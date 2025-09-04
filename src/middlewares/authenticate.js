import { verifyToken } from '../helpers/jwtHelper.js';

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
        }
        const decodedToken = verifyToken(token);
        req.user = decodedToken;
        next();

    } catch (error) {
        console.error('Error de autenticación:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado. Por favor, inicie sesión de nuevo.' });
        }
        res.status(401).json({ message: 'Token de autenticación inválido.' });
    }
};



export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado: usuario no autenticado.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado: no tiene los permisos necesarios.' });
        }
        next();
    };
};