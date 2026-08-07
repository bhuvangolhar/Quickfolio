import { Router } from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  resetCertifications,
} from '../controllers/certifications.controller.js';
import { requireAdminKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getCertifications);
router.post('/', requireAdminKey, createCertification);
router.post('/reset', requireAdminKey, resetCertifications);
router.put('/:id', requireAdminKey, updateCertification);
router.delete('/:id', requireAdminKey, deleteCertification);

export default router;