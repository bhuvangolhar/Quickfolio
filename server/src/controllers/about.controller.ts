import type { Request, Response } from 'express';
import About from '../models/about.model.js';

export const getAbout = async (_req: Request, res: Response): Promise<void> => {
  try {
    let about = await About.findOne();

    // Seed default data if database record is missing
    if (!about) {
      about = await About.create({
        section: '01 - ABOUT',
        heading: 'The person behind the code',
        subtitle: 'A passion for transforming ideas into elegant digital solutions that make an impact.',
        description:
          "I'm a Full Stack Developer with a deep fascination for building modern web applications that solve real-world problems. Currently focused on creating seamless user experiences with cutting-edge technologies.\n\nBeyond coding, I believe in continuous learning and sharing knowledge with the developer community. I'm always excited to collaborate on innovative projects that push boundaries.",
        code_filename: 'developer.config.json',
        code_content: `{\n  "name": "Developer",\n  "role": "Full Stack",\n  "focus": [\n    "Frontend",\n    "Backend",\n    "Performance"\n  ],\n  "currently": "Building awesome projects"\n}\n// Let's build something incredible.`,
        stat1_value: '10+',
        stat1_label: 'PROJECTS COMPLETED',
        stat2_value: '5+',
        stat2_label: 'TECH STACKS',
        stat3_value: '3+',
        stat3_label: 'YEARS EXPERIENCE',
        stat4_value: '100%',
        stat4_label: 'COMMITMENT',
      });
    }

    res.json(about);
  } catch (err) {
    console.error('Error fetching about section:', err);
    res.status(500).json({ error: 'Failed to fetch about data' });
  }
};

export const createOrUpdateAbout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;

    let about = await About.findOne();
    if (about) {
      await about.update(data);
    } else {
      about = await About.create(data);
    }

    res.json(about);
  } catch (err) {
    console.error('Error updating about section:', err);
    res.status(500).json({ error: 'Failed to update about data' });
  }
};