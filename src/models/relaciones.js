import User from '../models/user.js';
import Profile from '../models/profile.js';
import Article from '../models/article.js';
import Tag from '../models/tag.js';
import ArticleTag from '../models/articleTag.js';

User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Article, { foreignKey: 'user_id', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Article.belongsToMany(Tag, {
    through: ArticleTag,
    as: 'tags',
    foreignKey: 'article_id',
    otherKey: 'tag_id',
    onDelete: 'CASCADE'
});
Tag.belongsToMany(Article, {
    through: ArticleTag,
    as: 'articles',
    foreignKey: 'tag_id',
    otherKey: 'article_id',
    onDelete: 'CASCADE'
});

export {
    User,
    Profile,
    Article,
    Tag,
    ArticleTag
};