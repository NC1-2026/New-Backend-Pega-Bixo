import { Router } from 'express';
import { listAnimaisController } from './controller.listAnimais.js';

const router = Router();

router.get('/animais', listAnimaisController);

export default router;