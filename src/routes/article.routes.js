import { Router } from 'express';
import { body } from 'express-validator';
import { 
    getAllArticles, 
    getArticleById, 
    createArticle, 
    updateArticle, 
    deleteArticle 
} from '../controllers/article.controllers.js';
import { authenticate, authorize } from '../middlewares/authenticate.js';

const router = Router();

const articleValidation = [
    body('title')
        .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres.')
        .notEmpty().withMessage('El título es obligatorio.'),
    body('content')
        .isLength({ min: 50 }).withMessage('El contenido debe tener al menos 50 caracteres.')
        .notEmpty().withMessage('El contenido es obligatorio.'),
    body('excerpt')
        .optional({ checkFalsy: true })
        .isLength({ max: 500 }).withMessage('El extracto no puede exceder los 500 caracteres.'),
    body('status')
        .optional({ checkFalsy: true })
        .isIn(['published', 'archived']).withMessage('El estado del artículo no es válido.'),
    body('tags')
        .optional()
        .isArray().withMessage('Las etiquetas deben ser un array de strings.')
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            for (const tag of value) {
                if (typeof tag !== 'string' || tag.trim() === '') {
                    throw new Error('Cada etiqueta debe ser una cadena de texto no vacía.');
                }
            }
            return true;
        })
];

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', authenticate, articleValidation, createArticle);
router.put('/:id', authenticate, articleValidation, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;