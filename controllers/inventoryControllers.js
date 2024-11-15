import Sequelize from 'sequelize';
import { Productos, Inventarios, Movimientos, DetalleFacturas } from '../models/relations.js';
import { Op } from 'sequelize';

const mostrar_inventario_con_cantidad = async (req, res) => {
  const empresaId = req.usuario.empresaId;

  try {

    const inventarioData = await Inventarios.findAll({
      where: { empresaId },
      attributes: ['id', 'nombre', 'unidad', 'descripcion', 'bodega', 'encargado']
    });

    const inventarioConProductos = await Promise.all(inventarioData.map(async (inventario) => {
      const productos = await Productos.findAll({
        where: { inventario_id: inventario.id }, 
        attributes: ['id', 'nombre_producto', 'precio', 'descripcion', 'codigo_interno', 'codigo_barra']
      });

      const productosConCantidad = await Promise.all(productos.map(async (producto) => {
        const detalleFacturas = await DetalleFacturas.findAll({
          where: { producto_id: producto.id, empresaId },
          attributes: [[Sequelize.fn('SUM', Sequelize.col('cantidad')), 'cantidadTotal']],
          raw: true,
        });

        const cantidadTotal = detalleFacturas[0].cantidadTotal || 0; 
        return {
          ...producto.toJSON(),
          cantidadTotal: parseFloat(cantidadTotal)
        };
      }));

      return {
        ...inventario.toJSON(),
        productos: productosConCantidad
      };
    }));


    res.render('inventarios/inventario', { inventario: inventarioConProductos, csrfToken: req.csrfToken(), pagina: 'Inventario', pagina_activa: 'lista_inventario' });
  } catch (error) {
    console.error("Error al mostrar el inventario:", error);
    res.status(500).json({ message: "Error al mostrar el inventario" });
  }
};

const agregar_producto_inventario = async (req, res) => {
  const { nombre, unidad, descripcion, bodega, encargado } = req.body;
  const empresaId = req.usuario.empresaId;

  try {
    await Inventarios.create({
      empresaId,
      nombre,
      unidad,
      descripcion,
      bodega,
      encargado,
    });

    res.redirect('/inventario/lista_inventario'); 
  } catch (error) {
    console.error("Error al agregar el producto en inventario:", error);
    res.status(500).json({ message: "Error al agregar el producto en inventario" });
  }
};

const mostrar_productos = async (req, res) => {

  try {
    const empresaId = req.usuario.empresaId;

    const productos = await Productos.findAll({
      where: { empresaId },
      include: [{ model: Inventarios, as: 'inventario', attributes: ['nombre'] }],
    });

    const inventarios = await Inventarios.findAll({ where: { empresaId } });

    res.render('inventarios/productos', { productos, inventarios, csrfToken: req.csrfToken(), pagina: 'Productos', pagina_activa: 'productos' });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).send('Error al listar productos');
  }
}

const mostrar_ingresos = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;

    const ingresos = await Movimientos.findAll({
      where: {
        empresaId: empresaId,
        tipo_movimiento: 'entrada'
      },
      include: [
        {
          model: Productos,
          as: 'producto_movimiento',
          attributes: ['nombre_producto'] 
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.render('inventarios/ingresos', {
      pagina: 'Ingresos de Productos',
      ingresos,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error al mostrar los ingresos:', error);
    res.status(500).json({ success: false, message: 'Error al mostrar los ingresos' });
  }
};

const mostrar_salidas = async (req, res) => {
  try {
    const salidas = await Movimientos.findAll({
      where: { tipo_movimiento: 'salida', empresaId: req.usuario.empresaId },
      include: [
        {
          model: Productos,
          as: 'producto_movimiento',
          attributes: ['nombre_producto', 'codigo_barra'],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    const productos = await Productos.findAll({
      where: { empresaId: req.usuario.empresaId },
      attributes: ['id', 'nombre_producto', 'codigo_barra'],
    });

    res.render('inventarios/salidas', { pagina: 'Salidas', pagina_activa: 'salidas_inventario', salidas, productos, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error al listar movimientos:', error);
    res.status(500).send('Error al listar movimientos');
  }
    
}

const mostrar_pedidos = async (req, res) => {
    res.render('inventarios/pedidos', { pagina: 'Pedidos', pagina_activa: 'pedidos' });
}



const listar_movimientos = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId;
    const movimientos = await Movimientos.findAll({
      where: { empresaId, tipo_movimiento: 'salida' },
      include: [{ model: Productos, as: 'producto_movimiento', attributes: ['nombre_producto'] }],
      order: [['fecha', 'DESC']]
    });

    const productos = await Productos.findAll({ where: { empresaId } });

    res.render('movimientos/listar', { movimientos, productos, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error al listar movimientos:', error);
    res.status(500).send('Error al listar movimientos');
  }
};

const buscar_productos = async (req, res) => {
  try {
    const { query } = req.query;
    const productos = await Productos.findAll({
      where: {
        [Op.or]: [
          { nombre_producto: { [Op.like]: `%${query}%` } },
          { codigo_interno: { [Op.like]: `%${query}%` } },
          { codigo_barra: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'nombre_producto', 'codigo_interno', 'codigo_barra', 'cantidad']
    });
    res.json(productos || []);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ success: false, message: 'Error al buscar productos' });
  }
};


const registrar_salida = async (req, res) => {
  try {
    const { productos } = req.body;
    const empresaId = req.usuario.empresaId;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron productos para la salida.' });
    }
    console.log("Received productos data:", JSON.stringify(productos, null, 2));

    const salidas = productos.flatMap(producto => {
      return producto.producto_id.map((id, index) => ({
        empresaId,
        producto_id: id,
        tipo_movimiento: 'salida',
        cantidad: parseFloat(producto.cantidad[index]), 
        fecha: new Date(),
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
      }));
    });

    console.log("Salidas to be inserted:", JSON.stringify(salidas, null, 2));

    await Movimientos.bulkCreate(salidas);

    res.redirect('/inventario/salidas');
  } catch (error) {
    console.error('Error al registrar salida:', error);
    res.status(500).json({ success: false, message: 'Error al registrar la salida.' });
  }
};


export {
    mostrar_inventario_con_cantidad,
    agregar_producto_inventario,
    mostrar_ingresos,
    mostrar_salidas,
    mostrar_pedidos,
    mostrar_productos,
    listar_movimientos,
    registrar_salida,
    buscar_productos
}