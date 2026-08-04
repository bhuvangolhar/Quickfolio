import { Router } from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  resetSkills,
} from '../controllers/skills.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getSkills);
router.post('/', requireAdminKey, createSkill);
router.post('/reset', requireAdminKey, resetSkills);
router.put('/:id', requireAdminKey, updateSkill);
router.delete('/:id', requireAdminKey, deleteSkill);

export default router;