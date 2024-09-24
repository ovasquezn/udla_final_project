import express from 'express';
import { showIndex, test} from '../controllers/indexControllers.js'

const router = express.Router();

router.get('/', showIndex);
router.get('/test', test);

export default router;