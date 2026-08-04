import { Router } from 'express';
import {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
} from '../controllers/socials.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getSocials);
router.post('/', requireAdminKey, createSocial);
router.put('/:id', requireAdminKey, updateSocial);
router.delete('/:id', requireAdminKey, deleteSocial);

export default router;