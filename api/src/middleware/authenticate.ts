import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/tokens';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header.');
    }

    const token = authHeader.slice(7);
    const payload = await verifyAccessToken(token);

    req.user = {
      userId: payload.sub as string,
      email: payload.email,
      roles: payload.roles,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired access token.'));
    }
  }
}
