// const mostrar_inventario = (req, res) => {
//     res.render('inventory/inventario', {
//         pagina: 'Inventario',
//         pagina_activa: 'inventario'
//     })
// }

// export {
//     mostrar_inventario
// }

import { Producto } from '../models/Producto.js';
// Función para obtener todos los productos y renderizar la vista
const mostrar_inventario = async (req, res) => {
    try {
        const productos = await Producto.findAll(); 
        res.render('inventory/inventario', {
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