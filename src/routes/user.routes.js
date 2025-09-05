import { Router } from 'express';
import { body, param } from 'express-validator';
import {
    registerUser,
    loginUser,
    logoutUser,
    getAuthenticatedUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controllers.js';
import { authenticate, authorizeAdmin } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', [
    body('username')
        .isLength({ min: 3, max: 20 }).withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
        .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números.'),
    body('email').isEmail().withMessage('El correo electrónico debe ser válido.'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.')
], registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('El correo electrónico debe ser válido.'),
    body('password').notEmpty().withMessage('La contraseña no puede estar vacía.')
], loginUser);


router.get('/me', authenticate, getAuthenticatedUser);
router.post('/logout', authenticate, logoutUser);
router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.get('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.')
], getUserById);
router.put('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.')
], updateUser);
router.delete('/:id', authenticate, authorizeAdmin, [
    param('id').isInt().withMessage('El ID debe ser un número entero.')
], deleteUser);

export default router;