where,                                                                                      
      include: [{ model: Category, as: 'category' }],
      order: [['fecha', 'DESC']]
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error en listar:', error);                          
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

const balance = async (req, res) => {
  try {

    const transactions = await Transaction.findAll();

    const ingresos = transactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    const gastos = transactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    res.json({
      ingresos: ingresos.toFixed(2),
      gastos: gastos.toFixed(2),                                     
      balance: (ingresos - gastos).toFixed(2)
    });
  } catch (error) {
    console.error('Error en balance:', error);
    res.status(500).json({ error: 'Error al calcular balance' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, tipo, descripcion, fecha, categoryId } = req.body;
                                                                    
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {                        