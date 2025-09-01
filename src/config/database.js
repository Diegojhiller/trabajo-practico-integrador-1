import { Sequelize } from 'sequelize';
import 'dotenv/config';

const db = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
});

const connectDB = async () => {
    try {
        await db.authenticate();
        console.log('Hay conexion con la base de datos');
    } catch (error) {
        console.error('No se pudo conectar con la base de datos:', error);
        process.exit(1);
    }
};

export { db, connectDB };