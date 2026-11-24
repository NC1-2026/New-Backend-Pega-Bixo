import { Router } from 'express';
import { listAnimaisController } from './controller.listAnimais.js';

const router = Router();

router.get('/listanimais', listAnimaisController);

export default router;