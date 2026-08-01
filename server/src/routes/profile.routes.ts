import { Router } from 'express';
import { getProfile, createOrUpdateProfile } from '../controllers/profile.controller.js';
// import { requireAdminKey } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', getProfile);
// router.post('/', requireAdminKey, createOrUpdateProfile);

export default router;