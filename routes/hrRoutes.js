import express from 'express';
import { mostrar_colaboradores, agregar_trabajador, mostrar_liquidaciones, mostrar_comite_paritario, mostrar_personal_antiguo, mostrar_control_asisitencia, mostrar_perfil_colaborador, crear_liquidacion, editar_liquidacion, agregar_documento, editar_documento} from '../controllers/hrControllers.js';
import { verificar_jwt_token } from '../helpers/functions.js';

const router = express.Router();

router.get('/colaboradores',verificar_jwt_token , mostrar_colaboradores);
router.post('/agregar', verificar_jwt_token, agregar_trabajador);

router.get('/liquidaciones', verificar_jwt_token, mostrar_liquidaciones);
//router.post('/liquidaciones/agregar', verificar_jwt_token, agregar_liquidacion);
//router.post('/liquidaciones/crear_mes', verificar_jwt_token, crear_liquidaciones_mes);
router.post('/liquidaciones/crear_liquidacion/:colaboradorId/:anio-:mes', verificar_jwt_token, crear_liquidacion);
router.post('/liquidaciones/editar_liquidacion/:colaboradorId/:anio-:mes', verificar_jwt_token, editar_liquidacion);

//router.get('vacaciones', verificar_jwt_token, mostrar_vacaciones);
router.post('/colaboradores/documentos/agregar', verificar_jwt_token, agregar_documento);
router.post('/colaboradores/documentos/editar/:id', verificar_jwt_token, editar_documento);


router.get('/comite_paritario', verificar_jwt_token, mostrar_comite_paritario);
router.get('/personal_antiguo', verificar_jwt_token, mostrar_personal_antiguo);
router.get('/control_asistencia', verificar_jwt_token, mostrar_control_asisitencia);

router.get('/perfil_colaborador/:id', verificar_jwt_token, mostrar_perfil_colaborador);

export default router;