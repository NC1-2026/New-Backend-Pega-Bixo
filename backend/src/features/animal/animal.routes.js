import { Router } from 'express';
import { criar } from './animal.controller.js';

const router = Router();
router.post('/', criar);

export default router;