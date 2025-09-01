import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';

const ArticleTag = db.define('ArticleTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'articles_tags',
    underscored: true
});

export default ArticleTag;