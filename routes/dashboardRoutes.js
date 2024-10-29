//const express = require('express');
import express from 'express';
const router = express.Router();
import { dashboard } from '../controllers/dashboardControllers.js';
//import { protegerRuta } from '../helpers/protegerRuta.js';

//router.get('/',protegerRuta, dashboard);

//module.exports = router;
;

import { verificarToken } from '../helpers/protegerRuta.js';

router.get('/', verificarToken, dashboard);

export default router