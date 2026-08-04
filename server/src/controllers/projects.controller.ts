import type { Request, Response } from 'express';
import Project from '../models/projects.model.js';

const DEFAULT_PROJECTS = [
  {
    year: '2024',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard. Built with modern technologies for optimal performance.',
    techStack: 'React, Node.js, PostgreSQL, Stripe, Redis',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    github: 'https://github.com/yourusername/ecommerce',
    live: 'https://ecommerce-demo.vercel.app',
    order: 0,
  },
  {
    year: '2023',
    title: 'Task Management App',
    description:
      'Collaborative task management application with real-time updates, team workspaces, and productivity analytics. Features drag-and-drop interface and automated workflows.',
    techStack: 'Vue.js, Express, MongoDB, Socket.io',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    github: 'https://github.com/yourusername/taskapp',
    live: 'https://taskapp-demo.vercel.app',
    order: 1,
  },
  {
    year: '2023',
    title: 'AI Content Generator',
    description:
      "AI-powered content generation tool using OpenAI's GPT models. Supports multiple content types including blog posts, social media, and marketing copy with customizable tone and style.",
    techStack: 'Next.js, TypeScript, OpenAI, TailwindCSS',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    github: 'https://github.com/yourusername/ai-content',
    live: 'https://ai-content-demo.vercel.app',
    order: 2,
  },
];

export const getProjects = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let projects = await Project.findAll({ order: [['order', 'ASC']] });

    // Auto-create 3 default projects if none exist
    if (projects.length === 0) {
      await Project.bulkCreate(DEFAULT_PROJECTS);
      projects = await Project.findAll({ order: [['order', 'ASC']] });
    }

    res.json(projects);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      res.status(400).json({ message: 'Invalid project id' });
      return;
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await project.update(req.body);
    res.json(project);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      res.status(400).json({ message: 'Invalid project id' });
      return;
    }

    const deleted = await Project.destroy({
      where: { id: projectId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const resetProjects = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Delete all existing projects
    await Project.destroy({ where: {}, truncate: true });

    // Recreate 3 default projects
    const projects = await Project.bulkCreate(DEFAULT_PROJECTS);
    res.json({ message: 'Projects reset to 3 defaults', projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset projects' });
  }
};