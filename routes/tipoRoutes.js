const express = require('express');
const router = express.Router();
const Tipo = require('../models/Tipo');
const Area = require('../models/Area');

router.post('/', async (req, res) => {
  const tipo = await Tipo.create({ 
    nome: req.body.nome,
    areaId: req.body.areaId 
  });
  res.json(tipo);
});

router.get('/', async (req, res) => {
  const tipi = await Tipo.findAll({ include: [Area] });
  res.json(tipi);
});

// Route per ottenere tipologie di una specifica area
router.get('/area/:areaId', async (req, res) => {
  const tipi = await Tipo.findAll({ 
    where: { areaId: req.params.areaId },
    include: [Area] 
  });
  res.json(tipi);
});

// Route per eliminare una tipologia
router.delete('/:id', async (req, res) => {
  const tipo = await Tipo.findByPk(req.params.id);
  if (!tipo) {
    return res.status(404).json({ error: 'Tipologia non trovata' });
  }
  await tipo.destroy();
  res.json({ success: true });
});

module.exports = router;