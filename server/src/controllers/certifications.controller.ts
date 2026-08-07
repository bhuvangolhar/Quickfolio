import type { Request, Response } from 'express';
import Certification from '../models/certifications.model.js';

const DEFAULT_CERTIFICATIONS = [
  {
    name: 'AWS Solutions Architect',
    provider: 'Amazon Web Services',
    year: '2024',
    description:
      'Professional certification for designing distributed systems on AWS',
    tools: 'AWS, EC2, S3, Lambda, CloudFormation',
    credential_url: 'https://aws.amazon.com/certification',
    order: 0,
  },
  {
    name: 'TensorFlow Developer Certificate',
    provider: 'Google',
    year: '2023',
    description:
      'Certification demonstrating proficiency in using TensorFlow for ML applications',
    tools: 'TensorFlow, Python, Keras, Deep Learning',
    credential_url: 'https://www.tensorflow.org/certificate',
    order: 1,
  },
  {
    name: 'Microsoft Azure Fundamentals',
    provider: 'Microsoft',
    year: '2023',
    description:
      'Foundation-level understanding of cloud services and Azure',
    tools: 'Azure, Cloud Computing, DevOps',
    credential_url: 'https://learn.microsoft.com/certifications',
    order: 2,
  },
];

export const getCertifications = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let certs = await Certification.findAll({ order: [['order', 'ASC']] });

    // Auto-create 3 default certifications if none exist
    if (certs.length === 0) {
      await Certification.bulkCreate(DEFAULT_CERTIFICATIONS);
      certs = await Certification.findAll({ order: [['order', 'ASC']] });
    }

    res.json(certs);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cert = await Certification.create(req.body);
    res.json(cert);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const certId = Number(req.params.id);

    if (!Number.isInteger(certId)) {
      res.status(400).json({ message: 'Invalid certification id' });
      return;
    }

    const cert = await Certification.findByPk(certId);

    if (!cert) {
      res.status(404).json({ message: 'Certification not found' });
      return;
    }

    await cert.update(req.body);
    res.json(cert);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const certId = Number(req.params.id);

    if (!Number.isInteger(certId)) {
      res.status(400).json({ message: 'Invalid certification id' });
      return;
    }

    const deleted = await Certification.destroy({
      where: { id: certId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Certification not found' });
      return;
    }

    res.json({ message: 'Certification deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const resetCertifications = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Truncate existing certifications
    await Certification.destroy({ where: {}, truncate: true });

    // Recreate 3 default certifications
    const certs = await Certification.bulkCreate(DEFAULT_CERTIFICATIONS);
    res.json({ message: 'Certifications reset to 3 defaults', certs });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};