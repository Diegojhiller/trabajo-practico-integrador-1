import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ArticleTag = sequelize.define(
'ArticleTag',
    {
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
    sequelize,
    timestamps: false,
    tableName: 'articles_tags',
    underscored: true
});

export default ArticleTag;