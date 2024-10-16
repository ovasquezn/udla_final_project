import { Productos } from '../models/Productos.js';

const mostrar_inventario = async (req, res) => {
    try {
        const personas = [
            { nombre: 'Juan', apellido: 'Pérez', edad: 30, profesion: 'Ingeniero' },
            { nombre: 'Ana', apellido: 'García', edad: 25, profesion: 'Diseñadora' },
            { nombre: 'Carlos', apellido: 'Lopez', edad: 40, profesion: 'Doctor' },
            { nombre: 'María', apellido: 'Rodríguez', edad: 35, profesion: 'Abogada' }
        ];
        const productos = await Productos.findAll(); 
        res.render('inventory/inventario', {
            personas,
            productos,
            pagina: 'Inventario',
            pagina_activa: 'inventario' });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
};

const mostrar_detalle = async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.render('inventory/producto_detalle', { 
                producto,
                pagina: 'Detalle del producto',
                pagina_activa: 'inventario'});
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export {
    mostrar_inventario,
    mostrar_detalle
}