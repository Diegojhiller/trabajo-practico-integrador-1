import { User, Profile, Article } from '../models/relaciones.js'; 
import { validationResult } from 'express-validator';
import { hashPassword, comparePassword } from '../helpers/bcryptHelper.js';
import { generateToken } from '../helpers/jwtHelper.js';


export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });
        await Profile.create({ userId: newUser.id });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya están en uso.' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const token = generateToken({ id: user.id, role: user.role });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};

export const getAuthenticatedUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role'],
            include: [{ model: Profile, as: 'profile' }]
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario autenticado:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Profile, as: 'profile' }],
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios.', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: [
                { model: Profile, as: 'profile' },
                { model: Article, as: 'articles' }
            ],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario.', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role, ...profileData } = req.body;

        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (password) {
            const hashedPassword = await hashPassword(password);
            userToUpdate.password = hashedPassword;
        }
        if (username) userToUpdate.username = username;
        if (email) userToUpdate.email = email;
        if (role) userToUpdate.role = role;

        await userToUpdate.save();

        if (Object.keys(profileData).length > 0) {
            await Profile.update(profileData, {
                where: { userId: id }
            });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente.', user: userToUpdate });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya están en uso.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findByPk(id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await userToDelete.update({ deleted_at: new Date() });

        res.status(200).json({ message: 'Usuario eliminado lógicamente correctamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};