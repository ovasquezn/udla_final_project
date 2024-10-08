import express from 'express';
import {mostrar_login, mostrar_signup, registrar_usuario, iniciar_sesion} from '../controllers/authControllers.js';

const router = express.Router();

router.get('/login', mostrar_login);
router.post('/login', iniciar_sesion);
router.get('/signup', mostrar_signup);
router.post('/signup', registrar_usuario);

export default router;