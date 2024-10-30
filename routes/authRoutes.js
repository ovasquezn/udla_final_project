import express from 'express';
import {mostrar_login, mostrar_signup, registrar_usuario, iniciar_sesion, mostrar_recuperar_contrasena,recuperar_contrasena, mostrar_mensaje, salir} from '../controllers/authControllers.js';

const router = express.Router();

router.get('/login', mostrar_login);
router.post('/login', iniciar_sesion);

router.get('/signup', mostrar_signup);
router.post('/signup', registrar_usuario);

router.get('/logout', salir);

router.get('/recuperar_contrasena', mostrar_recuperar_contrasena);
router.post('/recuperar_contrasena', recuperar_contrasena);

// test
router.get('/mensaje', mostrar_mensaje);

export default router;