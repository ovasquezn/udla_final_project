//const express = require('express');
import express from 'express';
const router = express.Router();
import { dashboard } from '../controllers/dashboardControllers.js';

router.get('/', dashboard);

//module.exports = router;
export default router;