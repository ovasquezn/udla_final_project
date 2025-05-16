import Sequelize from 'sequelize';
import { Productos, Inventarios, Movimientos, DetalleFacturas } from '../models/relations.js';
import { Op } from 'sequelize';
import db from '../db.js';
import { check, validationResult } from 'express-validator';

const mostrar_inventario_con_cantidad = async (req, res) => {
  const empresaId = req.usuario.empresaId;

  try {
    // Obtener todas las salidas registradas asociadas a la empresa
    const salidas = await Movimientos.findAll({
      where: { tipo_movimiento: 'salida', empresaId },
      include: [
        {
          model: Productos,
          as: 'producto_movimiento',
          attributes: ['id', 'nombre_producto'],
        },
      ],
      attributes: ['cantidad', 'fecha'],
      raw: true,
      nest: true,
    });

    // Mapear salidas por producto
    const salidasMap = salidas.reduce((map, salida) => {
      const productoId = salida.producto_movimiento.id;
      if (!map[productoId]) {
        map[productoId] = [];
      }
      map[productoId].push({
        cantidad: salida.cantidad,
        fecha: salida.fecha,
        responsable: salida.responsable || 'No asignado',
        motivo: salida.motivo || 'No especificado',
      });
      return map;
    }, {});

    // Obtener los datos de inventario
    const inventarioData = await Inventarios.findAll({
      where: { empresaId },
      attributes: ['id', 'nombre', 'unidad', 'stock_minimo', 'descripcion', 'bodega', 'encargado'],
    });

    // Procesar productos y calcular cantidades
    const inventarioConProductos = await Promise.all(
      inventarioData.map(async (inventario) => {
        const productos = await Productos.findAll({
          where: { inventario_id: inventario.id },
          attributes: ['id', 'nombre_producto', 'precio', 'descripcion', 'codigo_interno', 'codigo_barra'],
        });

        const productosConCantidad = await Promise.all(
          productos.map(async (producto) => {
            // Obtener entradas
            const detalleFacturas = await DetalleFacturas.findAll({
              where: { producto_id: producto.id, empresaId },
              attributes: [[Sequelize.fn('SUM', Sequelize.col('cantidad')), 'cantidadTotal']],
              raw: true,
            });

            const cantidadEntradas = parseFloat(detalleFacturas[0]?.cantidadTotal || 0); // Total de entradas
            const cantidadSalidas = (salidasMap[producto.id] || []).reduce(
              (sum, salida) => sum + parseFloat(salida.cantidad),
              0
            ); // Total de salidas
            const cantidadTotal = cantidadEntradas - cantidadSalidas;

            return {
              ...producto.toJSON(),
              cantidadEntradas,
              cantidadSalidas,
              cantidadTotal: cantidadTotal > 0 ? cantidadTotal : 0,
              salidas: salidasMap[producto.id] || [], // Salidas asociadas al producto
            };
          })
        );

        return {
          ...inventario.toJSON(),
          productos: productosConCantidad,
        };
      })
    );

    // Renderizar la vista
    res.render('inventarios/inventario', {
      inventario: inventarioConProductos,
      csrfToken: req.csrfToken(),
      pagina: 'Inventario',
      pagina_activa: 'lista_inventario',
    });
  } catch (error) {
    console.error('Error al mostrar el inventario:', error);
    res.status(500).json({ message: 'Error al mostrar el inventario' });
  }
};



const agregar_producto_inventario = async (req, res) => {
  const { nombre, unidad, stock_minimo,  descripcion, bodega, encargado } = req.body;
  const empresaId = req.usuario.empresaId;

  try {
    await Inventarios.create({
      empresaId,
      nombre,
      unidad,
      stock_minimo,
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
      pagina_activa: 'ingresos_inventario',
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



const mostrar_inventario_con_salidas = async (req, res) => {
  const empresaId = req.usuario.empresaId;

  try {
    // Obtener datos del inventario
    const inventarioData = await Inventarios.findAll({
      where: { empresaId },
      attributes: ['id', 'nombre', 'unidad', 'stock_minimo', 'descripcion', 'bodega', 'encargado'],
      include: [
        {
          model: Productos,
          as: 'productos',
          attributes: ['id', 'nombre_producto', 'precio', 'codigo_interno', 'codigo_barra'],
        },
      ],
    });

    // Obtener salidas de productos
    const salidas = await Movimientos.findAll({
      where: { tipo_movimiento: 'salida', empresaId },
      include: [
        {
          model: Productos,
          as: 'producto',
          attributes: ['nombre_producto'],
        },
      ],
    });

    res.render('inventarios/inventario', {
      inventario: inventarioData,
      salidas,
      csrfToken: req.csrfToken(),
      pagina: 'Inventario',
      pagina_activa: 'lista_inventario',
    });
  } catch (error) {
    console.error('Error al mostrar inventario con salidas:', error);
    res.status(500).json({ message: 'Error al mostrar el inventario y las salidas.' });
  }
};


// const registrar_salida = async (req, res) => {
//   try {
//     const { productos } = req.body;
//     const empresaId = req.usuario.empresaId;

//     if (!productos || !Array.isArray(productos) || productos.length === 0) {
//       return res.status(400).json({ success: false, message: 'No se proporcionaron productos para la salida.' });
//     }
//     console.log("Received productos data:", JSON.stringify(productos, null, 2));

//     const salidas = productos.flatMap(producto => {
//       return producto.producto_id.map((id, index) => ({
//         empresaId,
//         producto_id: id,
//         tipo_movimiento: 'salida',
//         cantidad: parseFloat(producto.cantidad[index]), 
//         fecha: new Date(),
//         fecha_creacion: new Date(),
//         fecha_actualizacion: new Date()
//       }));
//     });

//     console.log("Salidas to be inserted:", JSON.stringify(salidas, null, 2));

//     await Movimientos.bulkCreate(salidas);

//     res.redirect('/inventario/salidas');
//   } catch (error) {
//     console.error('Error al registrar salida:', error);
//     res.status(500).json({ success: false, message: 'Error al registrar la salida.' });
//   }
// };


const registrar_salida = async (req, res) => {
  const { productos } = req.body; // Productos enviados desde el formulario
  const empresaId = req.usuario.empresaId; // Empresa del usuario autenticado

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ success: false, message: 'No se proporcionaron productos para la salida.' });
  }

  const transaction = await db.transaction(); // Inicia una transacción
  try {
    // Construir las salidas con validación de datos
    const salidas = productos.map(producto => {
      if (!producto.producto_id || isNaN(producto.cantidad) || producto.cantidad <= 0) {
        throw new Error(`Datos inválidos para el producto: ${JSON.stringify(producto)}`);
      }

      return {
        empresaId,
        producto_id: producto.producto_id,
        tipo_movimiento: 'salida',
        cantidad: parseFloat(producto.cantidad),
        fecha: new Date(),
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      };
    });

    // Registrar las salidas en la base de datos
    await Movimientos.bulkCreate(salidas, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    // Redirigir al usuario a la vista de salidas
    res.redirect('/inventario/salidas');
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await transaction.rollback();
    console.error('Error al registrar salida:', error);
    res.status(500).json({ success: false, message: 'Error al registrar la salida.', error: error.message });
  }
};

const crear_producto = async (req, res) => {
  // Validaciones usando express-validator
  await Promise.all([
    check('codigo_barra')
      .notEmpty().withMessage('El código de barra es requerido.')
      .isNumeric().withMessage('El código de barra debe ser numérico.')
      .run(req),
    check('nombre_producto')
      .notEmpty().withMessage('El nombre del producto es requerido.')
      .isString().withMessage('El nombre del producto debe ser una cadena de texto.')
      .isLength({ min: 3 }).withMessage('El nombre del producto debe tener al menos 3 caracteres.')
      .run(req),
    check('inventario_id')
      .notEmpty().withMessage('Debe seleccionar un inventario.')
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Retornar errores en formato JSON
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { codigo_barra, nombre_producto, inventario_id } = req.body;
    const empresaId = req.usuario.empresaId;

    const nuevoProducto = await Productos.create({
      empresaId,
      codigo_barra,
      nombre_producto,
      inventario_id,
      codigo_interno: codigo_barra, 
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    // Devolver respuesta JSON de éxito con el producto creado
    return res.json({
      success: true,
      message: 'Producto creado exitosamente',
      producto: nuevoProducto
    });

  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ success: false, message: 'Error al crear el producto' });
  }
};

export {
    mostrar_inventario_con_cantidad,
    crear_producto,
    agregar_producto_inventario,
    mostrar_ingresos,
    mostrar_salidas,
    mostrar_pedidos,
    mostrar_productos,
    listar_movimientos,
    registrar_salida,
    buscar_productos
}