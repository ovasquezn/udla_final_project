import express from 'express';
import { showInventory} from '../controllers/inventoryControllers.js'

const router = express.Router();

router.get('/', showInventory);

export default router;