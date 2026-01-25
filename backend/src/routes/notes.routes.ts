import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as notesController from '../controllers/notes.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', notesController.getAllNotes);
router.post('/', notesController.createNote);
router.get('/:id', notesController.getNoteById);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.patch('/:id/pin', notesController.togglePin);
router.patch('/:id/favorite', notesController.toggleFavorite);

export default router;
