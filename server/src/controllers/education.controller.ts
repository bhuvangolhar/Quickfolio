import type { Request, Response } from 'express';
import Education from '../models/education.model.js';

const DEFAULT_EDUCATION = [
  {
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    duration: '2022 - 2024',
    description:
      'Specialized in Machine Learning and Artificial Intelligence. Thesis on deep learning optimization techniques.',
    skills: 'Machine Learning, Deep Learning, Python, Research',
    order: 0,
  },
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'Indian Institute of Technology',
    location: 'Mumbai, India',
    duration: '2018 - 2022',
    description:
      'Graduated with honors. Focus on software engineering and data structures. Active member of coding club.',
    skills: 'Data Structures, Algorithms, Java, Web Development',
    order: 1,
  },
];

export const getEducation = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let education = await Education.findAll({ order: [['order', 'ASC']] });

    // Auto-create 2 default education entries if none exist
    if (education.length === 0) {
      await Education.bulkCreate(DEFAULT_EDUCATION);
      education = await Education.findAll({ order: [['order', 'ASC']] });
    }

    res.json(education);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const edu = await Education.create(req.body);
    res.json(edu);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const educationId = Number(req.params.id);

    if (!Number.isInteger(educationId)) {
      res.status(400).json({ message: 'Invalid education id' });
      return;
    }

    const edu = await Education.findByPk(educationId);

    if (!edu) {
      res.status(404).json({ message: 'Education not found' });
      return;
    }

    await edu.update(req.body);
    res.json(edu);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const educationId = Number(req.params.id);

    if (!Number.isInteger(educationId)) {
      res.status(400).json({ message: 'Invalid education id' });
      return;
    }

    const deleted = await Education.destroy({
      where: { id: educationId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Education not found' });
      return;
    }

    res.json({ message: 'Education deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const resetEducation = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Truncate existing education entries
    await Education.destroy({ where: {}, truncate: true });

    // Recreate 2 default entries
    const education = await Education.bulkCreate(DEFAULT_EDUCATION);
    res.json({ message: 'Education reset to 2 defaults', education });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};