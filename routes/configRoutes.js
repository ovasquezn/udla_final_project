import express from 'express';
import { mostrar_usuarios, crear_usuario, mostrar_bancos, agregar_banco } from '../controllers/configControllers.js';
import { verificar_jwt_token } from '../helpers/functions.js';

const router = express.Router();

router.get('/usuarios', verificar_jwt_token, mostrar_usuarios);
router.post('/usuarios/agregar_usuario', verificar_jwt_token, crear_usuario);

router.get('/bancos', verificar_jwt_token, mostrar_bancos);
router.post('/bancos/agregar_banco', verificar_jwt_token, agregar_banco);

export default router;