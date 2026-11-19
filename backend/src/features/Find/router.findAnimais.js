import { Router } from 'express';
import { findAnimalController } from './controller.findAnimais.js';

const router = Router();

router.get('/animais/:id', findAnimalController);

export default router;