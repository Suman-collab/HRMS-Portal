import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // both endpoints require the protect middleware

// GET /api/profile/:id
// PUT /api/profile/:id
router
    .route('/:id')
    .get(getProfile)
    .put(updateProfile);

export default router;
