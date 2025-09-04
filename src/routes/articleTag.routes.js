import { Router } from 'express';
import { addTagToArticle, removeTagFromArticle } from '../controllers/articleTag.controlles.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/', authenticate, addTagToArticle);
router.delete('/:articleTagId', authenticate, removeTagFromArticle);

export default router;