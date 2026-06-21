const formatearMonto = (monto) => {
  return parseFloat(monto).toFixed(2);
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toISOString().split('T')[0];
};

module.exports = { formatearMonto, formatearFecha };