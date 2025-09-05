import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sequelize  from './src/config/database.js';
import userRoutes from './src/routes/user.routes.js';
import tagRoutes from './src/routes/tag.routes.js';
import articleRoutes from './src/routes/article.routes.js';
import articleTagRoutes from './src/routes/articleTag.routes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/articles-tags', articleTagRoutes);

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');
       
        await sequelize.sync({alter: true});
        console.log ("Modelos sincronizados correctanemnte")
        
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();