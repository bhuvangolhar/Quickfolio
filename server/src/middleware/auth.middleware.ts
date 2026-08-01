import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const ADMIN_KEY = process.env.ADMIN_KEY || process.env.ADMIN_SECRET;
export const effectiveAdminKey = ADMIN_KEY || 'dev-admin-key-change-me';

// Warn in production if using the default fallback key
if (process.env.NODE_ENV === 'production' && !ADMIN_KEY) {
  console.warn('⚠️ WARNING: Using default admin key in production - set ADMIN_KEY environment variable');
}

/**
 * Performs timing-safe string comparison to prevent timing attack vulnerabilities.
 */
const safeCompare = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
};

export const requireAdminKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Read key safely from headers or query string
  const rawHeader = req.headers['x-admin-key'];
  const headerKey = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  const queryKey = typeof req.query.admin_key === 'string' ? req.query.admin_key : '';

  const key = headerKey || queryKey || '';

  // Log debug information in development mode
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔐 Admin auth check:');
    console.log('   Received key (masked):', key ? `${key.substring(0, 4)}***` : '(none)');
    console.log('   Expected key (masked):', `${effectiveAdminKey.substring(0, 4)}***`);
  }

  if (!key || !safeCompare(key, effectiveAdminKey)) {
    console.warn(`⚠️ Failed admin key attempt from IP: ${req.ip}`);
    res.status(401).json({ message: 'Admin key required or invalid' });
    return;
  }

  console.log('✅ Admin key validated successfully');
  next();
};