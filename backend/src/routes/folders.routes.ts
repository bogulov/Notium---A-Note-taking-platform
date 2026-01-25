import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as foldersController from '../controllers/folders.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', foldersController.getAllFolders);
router.post('/', foldersController.createFolder);
router.get('/:id', foldersController.getFolderById);
router.put('/:id', foldersController.updateFolder);
router.delete('/:id', foldersController.deleteFolder);

export default router;
