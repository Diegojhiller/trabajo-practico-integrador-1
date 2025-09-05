import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No autenticado. Por favor, inicia sesión.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};


export const authorizeOwner = (model) => {
    return async (req, res, next) => {
        const resourceId = req.params.id || req.body.articleId;

        try {
            const resource = await model.findByPk(resourceId);

            if (!resource) {
                return res.status(404).json({ message: 'Recurso no encontrado.' });
            }

            if (req.user.role === 'admin') {
                return next();
            }

            if (resource.user_id !== req.user.id) {
                return res.status(403).json({ message: 'Acceso denegado. No eres el propietario de este recurso.' });
            }

            next(); 
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar la propiedad del recurso.', error: error.message });
        }
    };
};