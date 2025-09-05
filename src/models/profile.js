import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Profile extends Model{}

Profile.init(
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, 
    {
    sequelize,
    timestamps: true,
    tableName: 'profiles',
    underscored: true
});

export default Profile;