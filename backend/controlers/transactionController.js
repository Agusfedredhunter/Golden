const { Transaction, Category } = require('../models');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');

const validarTransaccion = [
  body('monto').notEmpty().withMessage('El monto es requerido').isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
  body('tipo').notEmpty().withMessage('El tipo es requerido').isIn(['ingreso', 'gasto']).withMessage('El tipo debe ser ingreso o gasto'),
  body('fecha').notEmpty().withMessage('La fecha es requerida').isDate().withMessage('La fecha no es válida'),
  body('categoryId').notEmpty().withMessage('La categoría es requerida').isInt().withMessage('La categoría debe ser un número entero'),
];

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { monto, tipo, descripcion, fecha, categoryId } = req.body;

    const categoria = await Category.findByPk(categoryId);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const transaction = await Transaction.create({ monto, tipo, descripcion, fecha, categoryId });

    const resultado = await Transaction.findByPk(transaction.id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.status(201).json({ message: 'Transacción creada exitosamente', transaction: resultado });
  } catch (error) {
    console.error('Error en crear:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

const listar = async (req, res) => {
  try {
    const { tipo, categoryId, fechaDesde, fechaHasta } = req.query;

    const where = {};

    if (tipo) where.tipo = tipo;
    if (categoryId) where.categoryId = categoryId;
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha[Op.gte] = fechaDesde;
      if (fechaHasta) where.fecha[Op.lte] = fechaHasta;
    }

    const transactions = await Transaction.findAll({
