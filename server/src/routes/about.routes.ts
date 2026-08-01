import { Router } from 'express';
import { getAbout, createOrUpdateAbout } from '../controllers/about.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAbout);
router.post('/', requireAdminKey, createOrUpdateAbout);

export default router;