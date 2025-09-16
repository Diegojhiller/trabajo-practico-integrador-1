import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define(
    'User', 
        {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true, 
        deletedAt: 'deleted_at' 

    });

export default User;