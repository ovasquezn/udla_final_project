import express from 'express';
import { crear_producto, mostrar_inventario_con_cantidad, mostrar_ingresos, mostrar_salidas, mostrar_pedidos, mostrar_productos, agregar_producto_inventario, buscar_productos, registrar_salida} from '../controllers/inventoryControllers.js'
import { verificar_jwt_token } from '../helpers/functions.js';

const router = express.Router();

// Pendientes: agregar el middleware verificar_jwt_token

router.get('/lista_inventario', verificar_jwt_token, mostrar_inventario_con_cantidad);
//router.post('/agregar_producto_inventario', verificar_jwt_token, agregar_producto_inventario);
router.post('/lista_inventario/agregar_producto_inventario', verificar_jwt_token, agregar_producto_inventario);


router.get('/productos/buscar', verificar_jwt_token, buscar_productos);
router.post('/salidas/registrar_salida',verificar_jwt_token, registrar_salida);

router.get('/productos', verificar_jwt_token, mostrar_productos);
router.post('/productos/crear_producto', verificar_jwt_token, crear_producto);

router.get('/ingresos', verificar_jwt_token,mostrar_ingresos);
router.get('/salidas', verificar_jwt_token,mostrar_salidas);
router.get('/pedidos', verificar_jwt_token,mostrar_pedidos);
export default router;