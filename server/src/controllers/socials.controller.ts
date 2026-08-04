import type { Request, Response } from 'express';
import Social from '../models/socials.model.js';

export const getSocials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const socials = await Social.findAll();
    res.json(socials);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createSocial = async (req: Request, res: Response): Promise<void> => {
  try {
    const social = await Social.create(req.body);
    res.json(social);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteSocial = async (req: Request, res: Response): Promise<void> => {
  try {
    const socialId = Number(req.params.id);

    if (!Number.isInteger(socialId)) {
      res.status(400).json({ message: 'Invalid social id' });
      return;
    }

    const deleted = await Social.destroy({
      where: { id: socialId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Social not found' });
      return;
    }

    res.json({ message: 'Social deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateSocial = async (req: Request, res: Response): Promise<void> => {
  try {
    const socialId = Number(req.params.id);

    if (!Number.isInteger(socialId)) {
      res.status(400).json({ message: 'Invalid social id' });
      return;
    }

    const social = await Social.findByPk(socialId);
    if (!social) {
      res.status(404).json({ message: 'Social not found' });
      return;
    }

    await social.update(req.body);
    res.json(social);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};