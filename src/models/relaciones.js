import User from './user.js';
import Profile from './profile.js';
import Article from './article.js';
import Tag from './tag.js';
import ArticleTag from './articleTag.js';

User.hasOne(Profile, { as: 'profile', foreignKey: 'user_id' });
Profile.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

User.hasMany(Article, { as: 'articles', foreignKey: 'user_id' });
Article.belongsTo(User, { as: 'author', foreignKey: 'user_id' });

Article.belongsToMany(Tag, {
    through: ArticleTag,
    as: 'tags',
    foreignKey: 'article_id',
    otherKey: 'tag_id'
});
Tag.belongsToMany(Article, {
    through: ArticleTag,
    as: 'articles',
    foreignKey: 'tag_id',
    otherKey: 'article_id'
});

export {
    User,
    Profile,
    Article,
    Tag,
    ArticleTag
};