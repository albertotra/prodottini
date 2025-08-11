const express = require('express');
const router = express.Router();
const Oggetto = require('../models/Oggetto');
const Area = require('../models/Area');
const Tipo = require('../models/Tipo');

router.post('/', async (req, res) => {
  const oggetto = await Oggetto.create({
    nome: req.body.nome,
    tipoId: req.body.tipoId
  });
  res.json(oggetto);
});

router.get('/', async (req, res) => {
  const oggetti = await Oggetto.findAll({ 
    include: [
      {
        model: Tipo,
        include: [Area]
      }
    ] 
  });
  res.json(oggetti);
});

// Route per eliminare un oggetto
router.delete('/:id', async (req, res) => {
  const oggetto = await Oggetto.findByPk(req.params.id);
  if (!oggetto) {
    return res.status(404).json({ error: 'Oggetto non trovato' });
  }
  await oggetto.destroy();
  res.json({ success: true });
});

module.exports = router;