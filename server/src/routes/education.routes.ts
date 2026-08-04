import { Router } from 'express';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  resetEducation,
} from '../controllers/education.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getEducation);
router.post('/', requireAdminKey, createEducation);
router.post('/reset', requireAdminKey, resetEducation);
router.put('/:id', requireAdminKey, updateEducation);
router.delete('/:id', requireAdminKey, deleteEducation);

export default router;