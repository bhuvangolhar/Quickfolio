import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  resetProjects,
} from '../controllers/projects.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProjects);
router.post('/', requireAdminKey, createProject);
router.post('/reset', requireAdminKey, resetProjects);
router.put('/:id', requireAdminKey, updateProject);
router.delete('/:id', requireAdminKey, deleteProject);

export default router;