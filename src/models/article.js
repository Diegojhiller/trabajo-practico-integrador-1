import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Article extends Model{}

Article.init(
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    excerpt: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('published', 'archived'),
        defaultValue: 'published',
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'articles',
    underscored: true
});

export default Article;