import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllFolders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const folders = await prisma.folder.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { notes: { where: { deletedAt: null } } },
        },
      },
    });

    return res.json(
      new ApiResponse({
        data: folders,
        message: 'Folders fetched successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { name, color, icon } = req.body;

    if (!name) {
      throw new ApiError(400, 'Folder name is required', 'VALIDATION_ERROR');
    }

    const folder = await prisma.folder.create({
      data: {
        userId,
        name,
        color,
        icon,
      },
    });

    return res.status(201).json(
      new ApiResponse({
        data: folder,
        message: 'Folder created successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getFolderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const folder = await prisma.folder.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        notes: {
          where: { deletedAt: null },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!folder) {
      throw new ApiError(404, 'Folder not found', 'FOLDER_NOT_FOUND');
    }

    return res.json(
      new ApiResponse({
        data: folder,
        message: 'Folder retrieved successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, color, icon, position } = req.body;

    const folder = await prisma.folder.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!folder) {
      throw new ApiError(404, 'Folder not found', 'FOLDER_NOT_FOUND');
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: {
        name,
        color,
        icon,
        position,
      },
    });

    return res.json(
      new ApiResponse({
        data: updatedFolder,
        message: 'Folder updated successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const folder = await prisma.folder.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!folder) {
      throw new ApiError(404, 'Folder not found', 'FOLDER_NOT_FOUND');
    }

    await prisma.folder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Move notes to default folder
    const defaultFolder = await prisma.folder.findFirst({
      where: { userId, name: 'Notes', deletedAt: null },
    });

    if (defaultFolder) {
      await prisma.note.updateMany({
        where: { folderId: id },
        data: { folderId: defaultFolder.id },
      });
    }

    return res.json(
      new ApiResponse({
        data: { id },
        message: 'Folder deleted successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};
