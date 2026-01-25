import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required', 'VALIDATION_ERROR');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered', 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    // Create default folder
    await prisma.folder.create({
      data: {
        userId: user.id,
        name: 'Notes',
        position: 0,
      },
    });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        deviceName: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return res.status(201).json(
      new ApiResponse({
        data: {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        message: 'Registration successful',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required', 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        deviceName: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json(
      new ApiResponse({
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        message: 'Login successful',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }

    return res.json(
      new ApiResponse({
        data: user,
        message: 'User retrieved successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};
