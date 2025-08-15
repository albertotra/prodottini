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
  saveUninitialized: false
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

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER &&
      await bcrypt.compare(password, process.env.ADMIN_PASS)) {
    req.session.user = username;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Credenziali non valide' });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Rotte API protette
app.use('/api/aree', checkAuth, require('./routes/areaRoutes'));
app.use('/api/tipi', checkAuth, require('./routes/tipoRoutes'));
app.use('/api/oggetti', checkAuth, require('./routes/oggettoRoutes'));

// Servizio dei file statici
app.use(express.static(path.join(__dirname, 'public')));

// Protezione della pagina index.html
app.get('/index.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvio server
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`✅ Server avviato su porta ${process.env.PORT || 3000}`);
  });
});