import type { Request, Response } from 'express';
import Skill from '../models/skills.model.js';

const DEFAULT_SKILLS = [
  {
    name: 'Machine Learning & AI',
    description: 'Building intelligent systems with deep learning and neural networks',
    icon: '🧠',
    tools: 'TensorFlow, PyTorch, Scikit-Learn, Deep Learning, Computer Vision, NLP',
    order: 0,
  },
  {
    name: 'Data Analytics & BI',
    description: 'Transforming data into actionable insights with visualization',
    icon: '📊',
    tools: 'Power BI, Tableau, SQL, Statistics, Excel, Data Visualization',
    order: 1,
  },
  {
    name: 'Backend & APIs',
    description: 'Scalable server-side applications and RESTful services',
    icon: '⚡',
    tools: 'Python, Flask, Streamlit, REST APIs, Node.js, Express',
    order: 2,
  },
  {
    name: 'Databases',
    description: 'Designing and managing relational and NoSQL databases',
    icon: '💾',
    tools: 'MySQL, PostgreSQL, MongoDB, SQL, NoSQL',
    order: 3,
  },
  {
    name: 'DevOps & Cloud',
    description: 'Deploying and scaling applications on cloud platforms',
    icon: '🚀',
    tools: 'Docker, Oracle Cloud, Git, CI/CD, AWS, Azure',
    order: 4,
  },
  {
    name: 'AI Tools & Models',
    description: 'Working with cutting-edge AI models and frameworks',
    icon: '🤖',
    tools: 'GPT-4, Claude, LangChain, Chatbots, LLVM, OpenAI',
    order: 5,
  },
];

export const getSkills = async (_req: Request, res: Response): Promise<void> => {
  try {
    let skills = await Skill.findAll({ order: [['order', 'ASC']] });

    // Auto-create 6 default skills if none exist
    if (skills.length === 0) {
      await Skill.bulkCreate(DEFAULT_SKILLS);
      skills = await Skill.findAll({ order: [['order', 'ASC']] });
    }

    res.json(skills);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.create(req.body);
    res.json(skill);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillId = Number(req.params.id);

    if (!Number.isInteger(skillId)) {
      res.status(400).json({ message: 'Invalid skill id' });
      return;
    }

    const deleted = await Skill.destroy({
      where: { id: skillId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }

    res.json({ message: 'Skill deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillId = Number(req.params.id);

    if (!Number.isInteger(skillId)) {
      res.status(400).json({ message: 'Invalid skill id' });
      return;
    }

    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }

    await skill.update(req.body);
    res.json(skill);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const resetSkills = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Delete all existing skills
    await Skill.destroy({ where: {}, truncate: true });

    // Recreate 6 default skills
    const skills = await Skill.bulkCreate(DEFAULT_SKILLS);
    res.json({ message: 'Skills reset to 6 defaults', skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset skills' });
  }
};