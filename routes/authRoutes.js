//const express = require('express');
import express from 'express';
const router = express.Router();
import {test, login, register, showAuth} from '../controllers/authControllers.js';
//const { register, login } = require('../controllers/authController'); // Importa las funciones del controlador

// Ruta de registro de usuario

router.get('/', showAuth);
router.post('/registro', register);
router.post('/ingreso', login);
router.post('/test', test);

//module.exports = router;
export default router;