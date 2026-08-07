import type { Request, Response } from 'express';
import Experience from '../models/experience.model.js';

const DEFAULT_EXPERIENCES = [
  {
    date_range: 'JAN 2025 - PRESENT',
    role: 'Senior Full Stack Developer',
    company: 'Tech Company Inc.',
    location: 'San Francisco, CA',
    tech_stack: 'Node.js, React, TypeScript, PostgreSQL, AWS',
    description:
      '▸ Led development of scalable microservices architecture\n▸ Mentored junior developers and conducted code reviews\n▸ Improved application performance by 40%',
    order: 0,
  },
  {
    date_range: 'MAR 2023 - DEC 2024',
    role: 'Full Stack Developer',
    company: 'Startup Solutions',
    location: 'Remote',
    tech_stack: 'Express, MongoDB, React, Docker',
    description:
      '▸ Built RESTful APIs using Node.js and Express\n▸ Developed responsive frontends with React and TypeScript\n▸ Implemented CI/CD pipelines with GitHub Actions',
    order: 1,
  },
  {
    date_range: 'JUN 2022 - FEB 2023',
    role: 'Software Engineer Intern',
    company: 'Innovation Labs',
    location: 'New York, NY',
    tech_stack: 'Python, Django, JavaScript, MySQL',
    description:
      '▸ Collaborated with cross-functional teams on product features\n▸ Wrote unit tests achieving 85% code coverage\n▸ Participated in agile development sprints',
    order: 2,
  },
];

export const getAllExperiences = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let experiences = await Experience.findAll({ order: [['order', 'ASC']] });

    // Auto-create 3 default experiences if none exist
    if (experiences.length === 0) {
      await Experience.bulkCreate(DEFAULT_EXPERIENCES);
      experiences = await Experience.findAll({ order: [['order', 'ASC']] });
    }

    res.json(experiences);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to fetch experiences' });
  }
};

export const createExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experience = await Experience.create(req.body);
    res.json(experience);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to create experience' });
  }
};

export const updateExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experienceId = Number(req.params.id);

    if (!Number.isInteger(experienceId)) {
      res.status(400).json({ error: 'Invalid experience id' });
      return;
    }

    const experience = await Experience.findByPk(experienceId);

    if (!experience) {
      res.status(404).json({ error: 'Experience not found' });
      return;
    }

    await experience.update(req.body);
    res.json(experience);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to update experience' });
  }
};

export const deleteExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experienceId = Number(req.params.id);

    if (!Number.isInteger(experienceId)) {
      res.status(400).json({ error: 'Invalid experience id' });
      return;
    }

    const experience = await Experience.findByPk(experienceId);

    if (!experience) {
      res.status(404).json({ error: 'Experience not found' });
      return;
    }

    await experience.destroy();
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to delete experience' });
  }
};

export const resetExperiences = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Truncate existing experiences
    await Experience.destroy({ where: {}, truncate: true });

    // Recreate 3 default experiences
    const experiences = await Experience.bulkCreate(DEFAULT_EXPERIENCES);
    res.json({ message: 'Experiences reset to defaults', experiences });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to reset experiences' });
  }
};