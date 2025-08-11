const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

router.post('/', async (req, res) => {
  const area = await Area.create({ nome: req.body.nome });
  res.json(area);
});

router.get('/', async (req, res) => {
  const aree = await Area.findAll();
  res.json(aree);
});

// Route per eliminare un'area
router.delete('/:id', async (req, res) => {
  const area = await Area.findByPk(req.params.id);
  if (!area) {
    return res.status(404).json({ error: 'Area non trovata' });
  }
  await area.destroy();
  res.json({ success: true });
});

module.exports = router;