import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getAuthenticatedUser, updateUser, deleteUser } from '../controllers/user.controllers.js';
import { authenticate, authorize } from '../middlewares/authenticate.js';
import { body } from 'express-validator';

const router = Router();

const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 20 }).withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
        .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números.'),
    body('email')
        .isEmail().withMessage('El correo electrónico debe ser válido.'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.')
];

const loginValidation = [
    body('email').isEmail().withMessage('El correo electrónico debe ser válido.'),
    body('password').notEmpty().withMessage('La contraseña no puede estar vacía.')
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/me', authenticate, getAuthenticatedUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);
router.get('/all', authenticate, authorize(['admin']), (req, res) => {
    // En el futuro, aquí se podría implementar la lógica para listar todos los usuarios,
    // pero por ahora solo es un placeholder para mostrar el uso de `authorize`.
    res.status(200).json({ message: 'Ruta de administración, acceso concedido.' });
});

export default router;