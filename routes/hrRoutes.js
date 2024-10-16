import express from 'express';
import { mostrar_colaboradores } from '../controllers/hrControllers.js';

const router = express.Router();

router.get('/', mostrar_colaboradores);

export default router;