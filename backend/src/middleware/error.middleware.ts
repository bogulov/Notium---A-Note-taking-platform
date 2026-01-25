import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      new ApiResponse({
        success: false,
        message: err.message,
        data: {
          code: err.code,
          details: err.details,
        },
      })
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json(
    new ApiResponse({
      success: false,
      message: 'Internal server error',
      data: {
        code: 'INTERNAL_ERROR',
      },
    })
  );
};
