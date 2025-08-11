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
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(401).json({ error: 'Non autenticato' });
  }
  res.redirect('/login.html');
}

// Rotta login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER &&
      await bcrypt.compare(password, process.env.ADMIN_PASS)) {
    req.session.user = username;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Credenziali non valide' });
});

// Rotta logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Serviamo i file statici pubblici
app.use(express.static(path.join(__dirname, 'public')));

// Proteggiamo il backoffice
app.use('/aree', checkAuth, require('./routes/areaRoutes'));
app.use('/tipi', checkAuth, require('./routes/tipoRoutes'));
app.use('/oggetti', checkAuth, require('./routes/oggettoRoutes'));

// Se non loggato e prova ad accedere a /index.html → redirect login
app.get('/index.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server in ascolto...');
  });
});
