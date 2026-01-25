import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const {
      page = '1',
      limit = '20',
      folderId,
      pinned,
      favorite,
      search,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = req.query;

    const where: any = {
      userId,
      deletedAt: null,
    };

    if (folderId) where.folderId = folderId as string;
    if (pinned === 'true') where.isPinned = true;
    if (favorite === 'true') where.isFavorite = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { contentPlain: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder },
        select: {
          id: true,
          title: true,
          contentPlain: true,
          wordCount: true,
          isPinned: true,
          isFavorite: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          folder: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.note.count({ where }),
    ]);

    return res.json(
      new ApiResponse({
        data: {
          items: notes,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1,
          },
        },
        message: 'Notes fetched successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { title, content, folderId, tags } = req.body;

    const contentPlain = content ? stripHtml(content) : '';
    const wordCount = contentPlain.split(/\s+/).filter(Boolean).length;

    const note = await prisma.note.create({
      data: {
        userId,
        title: title || 'Untitled Note',
        content,
        contentPlain,
        wordCount,
        folderId,
        tags: tags || [],
        version: 1,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res.status(201).json(
      new ApiResponse({
        data: note,
        message: 'Note created successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        attachments: true,
      },
    });

    if (!note) {
      throw new ApiError(404, 'Note not found', 'NOTE_NOT_FOUND');
    }

    return res.json(
      new ApiResponse({
        data: note,
        message: 'Note retrieved successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, content, folderId, tags } = req.body;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!existingNote) {
      throw new ApiError(404, 'Note not found', 'NOTE_NOT_FOUND');
    }

    // Create version history
    await prisma.noteVersion.create({
      data: {
        noteId: id,
        userId,
        title: existingNote.title,
        content: existingNote.content,
        version: existingNote.version,
      },
    });

    const contentPlain = content ? stripHtml(content) : existingNote.contentPlain;
    const wordCount = contentPlain ? contentPlain.split(/\s+/).filter(Boolean).length : 0;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        contentPlain,
        wordCount,
        folderId,
        tags,
        version: existingNote.version + 1,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res.json(
      new ApiResponse({
        data: updatedNote,
        message: 'Note updated successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!note) {
      throw new ApiError(404, 'Note not found', 'NOTE_NOT_FOUND');
    }

    await prisma.note.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.json(
      new ApiResponse({
        data: { id },
        message: 'Note deleted successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const togglePin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!note) {
      throw new ApiError(404, 'Note not found', 'NOTE_NOT_FOUND');
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { isPinned: !note.isPinned },
    });

    return res.json(
      new ApiResponse({
        data: updatedNote,
        message: 'Note pin status updated',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!note) {
      throw new ApiError(404, 'Note not found', 'NOTE_NOT_FOUND');
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { isFavorite: !note.isFavorite },
    });

    return res.json(
      new ApiResponse({
        data: updatedNote,
        message: 'Note favorite status updated',
      })
    );
  } catch (error) {
    next(error);
  }
};
