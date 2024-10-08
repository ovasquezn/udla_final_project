import express from 'express';
import { mostrar_index } from '../controllers/indexControllers.js'

const router = express.Router();

router.get('/', mostrar_index);

export default router;