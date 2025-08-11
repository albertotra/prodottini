const express = require('express');
const router = express.Router();
const Tipo = require('../models/Tipo');

router.post('/', async (req, res) => {
  const tipo = await Tipo.create({ nome: req.body.nome });
  res.json(tipo);
});

router.get('/', async (req, res) => {
  const tipi = await Tipo.findAll();
  res.json(tipi);
});

module.exports = router;