const express = require('express');
const router = express.Router();
const Oggetto = require('../models/Oggetto');
const Area = require('../models/Area');
const Tipo = require('../models/Tipo');

router.post('/', async (req, res) => {
  const oggetto = await Oggetto.create({
    nome: req.body.nome,
    areaId: req.body.areaId,
    tipoId: req.body.tipoId
  });
  res.json(oggetto);
});

router.get('/', async (req, res) => {
  const oggetti = await Oggetto.findAll({ include: [Area, Tipo] });
  res.json(oggetti);
});

module.exports = router;