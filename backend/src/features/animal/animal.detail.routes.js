import { Router } from 'express';
import { detalhar } from './animal.detail.controller.js';

const router = Router();
router.get('/:id', detalhar);

export default router;