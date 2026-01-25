import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as aiController from '../controllers/ai.controller.js';

const router = Router();

router.use(authenticate);

router.post('/generate', aiController.handleAIGenerate);
router.post('/improve', aiController.handleAIImprove);
router.post('/summarize', aiController.handleAISummarize);
router.post('/translate', aiController.handleAITranslate);
router.post('/answer', aiController.handleAIAnswer);
router.get('/usage', aiController.getAIUsageStats);

export default router;
