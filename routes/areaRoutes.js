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

module.exports = router;