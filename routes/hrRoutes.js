import express from 'express';
import { mostrar_colaboradores, agregarTrabajador, mostrar_liquidaciones, mostrar_comite_paritario, mostrar_personal_antiguo, mostrar_control_asisitencia} from '../controllers/hrControllers.js';
import { verificarToken } from '../helpers/protegerRuta.js';

const router = express.Router();

router.get('/colaboradores',verificarToken , mostrar_colaboradores);
router.post('/agregar', verificarToken,agregarTrabajador);

router.get('/liquidaciones', verificarToken, mostrar_liquidaciones);
//router.post('/liquidaciones/agregar', verificarToken, agregar_liquidacion);

//router.get('vacaciones', verificarToken, mostrar_vacaciones);

router.get('/comite_paritario', verificarToken, mostrar_comite_paritario);
router.get('/personal_antiguo', verificarToken, mostrar_personal_antiguo);
router.get('/control_asistencia', verificarToken, mostrar_control_asisitencia);

export default router;