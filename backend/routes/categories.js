const express = require('express');
const router = express.Router();
const { Category } = require('../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['tipo', 'ASC'], ['nombre', 'ASC']] });
    res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, color } = req.body;
    const category = await Category.create({ nombre, tipo, color });
    res.status(201).json({ message: 'Categoría creada exitosamente', category });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

module.exports = router;