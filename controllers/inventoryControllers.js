import { Productos, Inventarios, Movimientos } from '../models/relations.js';

const mostrar_inventario_test = async (req, res) => {
    try {
        const personas = [
            { nombre: 'Juan', apellido: 'Pérez', edad: 30, profesion: 'Ingeniero' },
            { nombre: 'Ana', apellido: 'García', edad: 25, profesion: 'Diseñadora' },
            { nombre: 'Carlos', apellido: 'Lopez', edad: 40, profesion: 'Doctor' },
            { nombre: 'María', apellido: 'Rodríguez', edad: 35, profesion: 'Abogada' }
        ];
        const productos = await Productos.findAll(); 
        res.render('inventarios/inventario', {
            personas,
            productos,
            pagina: 'Inventario',
            pagina_activa: 'inventario' });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
};

// Controlador para mostrar los datos
const mostrar_inventario = async (req, res) => {
  try {
    //const empresaId = req.user.empresaId;  // Asegúrate de que el middleware coloca empresaId en req.user
    const empresaId = 1;  // Elimina esta línea si el middleware ya coloca empresaId en req.user

    // Obtener datos de productos, inventario y movimientos filtrados por empresaId
    const productos = await Productos.findAll({ where: { empresaId } });
    const inventario = await Inventarios.findAll({ where: { empresaId } });
    const movimientos = await Movimientos.findAll({ where: { empresaId } });

    res.render('inventarios/inventario', { productos, inventario, movimientos, pagina_activa: 'lista_inventario', csrfToken: req.csrfToken() });
  } catch (error) {
    console.error("Error al mostrar gestión de productos:", error);
    res.status(500).send("Error al cargar los datos.");
  }
}
const mostrar_detalle = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.render('inventorios/producto_detalle', { 
                producto,
                pagina: 'Detalle del producto',
                pagina_activa: 'lista_inventario'});
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
};

const mostrar_productos = async (req, res) => {
    res.render('inventarios/productos', { pagina: 'Productos', pagina_activa: 'productos' });
}

const mostrar_ingresos = async (req, res) => {
    res.render('inventarios/ingresos', { pagina: 'Ingresos', pagina_activa: 'ingresos' });
}

const mostrar_salidas = async (req, res) => {
    res.render('inventarios/salidas', { pagina: 'Salidas', pagina_activa: 'salidas' });
}

const mostrar_pedidos = async (req, res) => {
    res.render('inventarios/pedidos', { pagina: 'Pedidos', pagina_activa: 'pedidos' });
}

export {
    mostrar_inventario,
    mostrar_ingresos,
    mostrar_salidas,
    mostrar_pedidos,
    mostrar_productos
}