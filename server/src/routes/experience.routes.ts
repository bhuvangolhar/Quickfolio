import { Router } from 'express';
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  resetExperiences,
} from '../controllers/experience.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllExperiences);
router.post('/', requireAdminKey, createExperience);
router.post('/reset', requireAdminKey, resetExperiences);
router.put('/:id', requireAdminKey, updateExperience);
router.delete('/:id', requireAdminKey, deleteExperience);

export default router;