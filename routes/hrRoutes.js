//const express = require('express');
import express from 'express';
const router = express.Router();
import { hr } from '../controllers/hrControllers.js';

router.get('/', hr);

//module.exports = router;
export default router;