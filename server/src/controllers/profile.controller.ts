import type { Request, Response } from 'express';
import Profile from '../models/profile.model.js';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
};

export const createOrUpdateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, bio, contact_bio, avatar, resume } = req.body;

    // Fixed Security Vulnerability: Payload sanitization against mass assignment
    const sanitizedData = { name, role, bio, contact_bio, avatar, resume };

    let profile = await Profile.findOne();

    if (profile) {
      await profile.update(sanitizedData);
      res.json(profile);
      return;
    }

    profile = await Profile.create(sanitizedData);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};