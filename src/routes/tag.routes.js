import { Router } from 'express';
import { body, param } from 'express-validator';
import {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag
} from '../controllers/tag.controllers.js';
import { authenticate, authorizeAdmin } from '../middlewares/authenticate.js';

const router = Router();

router.post('/', authenticate, authorizeAdmin, [
    body('name').notEmpty().withMessage('El nombre de la etiqueta es obligatorio.')
], createTag);
router.get('/', authenticate, getAllTags);

router.get('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.')
], getTagById);

router.put('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('name').notEmpty().withMessage('El nombre de la etiqueta es obligatorio.')
], updateTag);

router.delete('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.')
], deleteTag);

export default router;