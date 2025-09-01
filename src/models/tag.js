import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';

const Tag = db.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('name', value.toLowerCase().replace(/\s/g, '-'));
        }
    }
}, {
    timestamps: true,
    tableName: 'tags',
    underscored: true
});

export default Tag;