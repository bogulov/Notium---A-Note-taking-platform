import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        subscriptionTier: string;
        aiTokensUsed: number;
        aiTokensLimit: number;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required', 'INVALID_TOKEN');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        isActive: true,
        subscriptionTier: true,
        aiTokensUsed: true,
        aiTokensLimit: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid authentication', 'INVALID_TOKEN');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid token', 'INVALID_TOKEN'));
    }
  }
};
