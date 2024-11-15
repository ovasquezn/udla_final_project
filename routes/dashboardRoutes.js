//const express = require('express');
import express from 'express';
const router = express.Router();
import { dashboard } from '../controllers/dashboardControllers.js';
//import { protegerRuta } from '../helpers/protegerRuta.js';

//router.get('/',protegerRuta, dashboard);

//module.exports = router;
;

import { verificar_jwt_token } from '../helpers/functions.js';

router.get('/', verificar_jwt_token, dashboard);

export default router