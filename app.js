import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db, connectDB } from './config/database.js';
import { User, Profile, Article, Tag, ArticleTag } from './models/relaciones.js'; 
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB(); 

        await db.sync({ alter: true }); 

        const defaultAdminPassword = await bcrypt.hash('AdminPassword123!', 10);
        await User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: {
                username: 'admin',
                email: 'admin@example.com',
                password: defaultAdminPassword,
                role: 'admin'
            }
        });
        
        app.use(express.json());
        app.use(cookieParser());
        app.use(cors());

        app.get('/', (req, res) => {
            res.send('¡Servidor de Blog Personal en funcionamiento!');
        });

        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();