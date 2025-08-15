const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sequelize = require('./models/index');
require('./models/Area');
require('./models/Tipo');
require('./models/Oggetto');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // metti true solo con HTTPS in produzione
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 ore
  }
}));

// Middleware di autenticazione
function checkAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  // Se la richiesta è API → rispondi JSON
  if (req.path.startsWith('/api')) {
    return res.status(401).json({ error: 'Non autenticato' });
  }
  // Se è una pagina → redirect a login
  res.redirect('/login.html');
}

// Route per verificare lo stato di autenticazione
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (username === process.env.ADMIN_USER &&
        await bcrypt.compare(password, process.env.ADMIN_PASS)) {
      req.session.user = username;
      return res.json({ success: true, message: 'Login effettuato con successo' });
    }
    res.status(401).json({ error: 'Credenziali non valide' });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Errore durante il logout:', err);
      return res.status(500).json({ error: 'Errore durante il logout' });
    }
    res.redirect('/login.html');
  });
});

// API logout per chiamate AJAX
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Errore durante il logout:', err);
      return res.status(500).json({ error: 'Errore durante il logout' });
    }
    res.json({ success: true, message: 'Logout effettuato con successo' });
  });
});

// Rotte API protette
app.use('/api/aree', checkAuth, require('./routes/areaRoutes'));
app.use('/api/tipi', checkAuth, require('./routes/tipoRoutes'));
app.use('/api/oggetti', checkAuth, require('./routes/oggettoRoutes'));

// Servizio dei file statici (login.html è pubblico)
app.use(express.static(path.join(__dirname, 'public')));

// Route principale - redirect automatico
app.get('/', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protezione della pagina index.html
app.get('/index.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route per login.html (sempre accessibile)
app.get('/login.html', (req, res) => {
  // Se già autenticato, redirect alla home
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Gestione delle route non trovate
app.get('*', (req, res) => {
  // Se non autenticato, mostra la pagina di login
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  // Se autenticato ma la route non esiste, redirect alla home
  res.redirect('/');
});

// Gestione degli errori globale
app.use((err, req, res, next) => {
  console.error('Errore:', err);
  
  if (req.path.startsWith('/api')) {
    res.status(500).json({ error: 'Errore interno del server' });
  } else {
    res.status(500).send('Errore interno del server');
  }
});

// Avvio server
sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Server avviato su porta ${port}`);
    console.log(`🔐 Login: ${process.env.ADMIN_USER ? 'Configurato' : 'NON configurato'}`);
    console.log(`🌐 Accedi su: http://localhost:${port}`);
  });
}).catch(err => {
  console.error('❌ Errore avvio database:', err);
  process.exit(1);
});