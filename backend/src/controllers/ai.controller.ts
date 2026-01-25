import { Request, Response, NextFunction } from 'express';
import { generateContent } from '../services/ai.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { prisma } from '../lib/prisma.js';

export const handleAIGenerate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { prompt, context, noteId, model } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: 'generate',
      prompt,
      context,
      model,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: 'Content generated successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const handleAIImprove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { text, noteId } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: 'improve',
      prompt: 'Improve this text:',
      context: text,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: 'Text improved successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const handleAISummarize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { text, noteId } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: 'summarize',
      prompt: 'Summarize this text in 3-5 bullet points:',
      context: text,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: 'Text summarized successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const handleAITranslate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { text, targetLanguage, noteId } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: 'translate',
      prompt: `Translate the following text to ${targetLanguage}:`,
      context: text,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: 'Text translated successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const handleAIAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { question, context, noteId } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: 'answer',
      prompt: question,
      context,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: 'Question answered successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAIUsageStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const [user, usage] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          aiTokensUsed: true,
          aiTokensLimit: true,
        },
      }),
      prisma.aIUsage.aggregate({
        where: { userId },
        _sum: {
          totalTokens: true,
          costUsd: true,
        },
        _count: true,
      }),
    ]);

    return res.json(
      new ApiResponse({
        data: {
          tokensUsed: user?.aiTokensUsed || 0,
          tokensLimit: user?.aiTokensLimit || 0,
          totalRequests: usage._count,
          totalCost: usage._sum.costUsd || 0,
        },
        message: 'AI usage stats retrieved',
      })
    );
  } catch (error) {
    next(error);
  }
};
