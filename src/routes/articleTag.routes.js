import { Router } from 'express';
import { body, param } from 'express-validator';
import { addTagToArticle, removeTagFromArticle } from '../controllers/articleTag.controlles.js';
import { authenticate, authorizeOwner } from '../middlewares/authenticate.js';
import { Article, ArticleTag } from '../models/relaciones.js';

const router = Router();

router.post('/', authenticate, authorizeOwner(Article), [
    body('articleId').isInt().withMessage('El ID del artículo debe ser un número entero.'),
    body('tagId').optional().isInt().withMessage('El ID de la etiqueta debe ser un número entero.'),
    body('tagName').optional().isString().withMessage('El nombre de la etiqueta debe ser un string.')
], addTagToArticle);

router.delete('/:articleTagId', authenticate, authorizeOwner(ArticleTag), [
    param('articleTagId').isInt().withMessage('El ID de la relación debe ser un número entero.')
], removeTagFromArticle);

export default router;