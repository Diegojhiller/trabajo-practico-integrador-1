import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Tag extends Model{}

Tag.init(
    {
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
    sequelize,
    timestamps: true,
    tableName: 'tags',
    underscored: true
});

export default Tag;