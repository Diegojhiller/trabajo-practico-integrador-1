import { Article, Tag, User } from '../models/relaciones.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const getAllArticles = async (req, res) => {
    try {
        const { status, tag, authorId, page = 1, limit = 10 } = req.query;
        const where = {};
        const include = [];

        if (status) {
            where.status = status;
        }
        if (authorId) {
            where.user_id = authorId;
        }

        if (tag) {
            include.push({
                model: Tag,
                as: 'tags',
                where: { name: tag },
                through: { attributes: [] }
            });
        }

        const offset = (page - 1) * limit;

        const articles = await Article.findAndCountAll({
            where,
            include: [
                ...include,
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalItems: articles.count,
            totalPages: Math.ceil(articles.count / limit),
            currentPage: parseInt(page),
            articles: articles.rows
        });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Error al obtener el artículo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const createArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, excerpt, status, tags = [] } = req.body;
        const newArticle = await Article.create({
            title,
            content,
            excerpt,
            status,
            user_id: req.user.id
        });

        if (tags.length > 0) {
            const tagInstances = await Promise.all(
                tags.map(tagName => Tag.findOrCreate({ where: { name: tagName.toLowerCase().replace(/\s/g, '-') } }))
            );
            const tagIds = tagInstances.map(instance => instance[0].id);
            await newArticle.setTags(tagIds);
        }

        const articleWithRelations = await Article.findByPk(newArticle.id, {
            include: [{ model: Tag, as: 'tags' }]
        });

        res.status(201).json({ message: 'Artículo creado exitosamente.', article: articleWithRelations });
    } catch (error) {
        console.error('Error al crear artículo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, status, tags = [] } = req.body;

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        if (article.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tiene permisos para actualizar este artículo.' });
        }

        article.title = title || article.title;
        article.content = content || article.content;
        article.excerpt = excerpt || article.excerpt;
        article.status = status || article.status;

        await article.save();

        if (tags.length > 0) {
            const tagInstances = await Promise.all(
                tags.map(tagName => Tag.findOrCreate({ where: { name: tagName.toLowerCase().replace(/\s/g, '-') } }))
            );
            const tagIds = tagInstances.map(instance => instance[0].id);
            await article.setTags(tagIds);
        } else {
            await article.setTags([]);
        }

        const articleWithRelations = await Article.findByPk(article.id, {
            include: [{ model: Tag, as: 'tags' }]
        });

        res.status(200).json({ message: 'Artículo actualizado exitosamente.', article: articleWithRelations });
    } catch (error) {
        console.error('Error al actualizar artículo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        if (article.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tiene permisos para eliminar este artículo.' });
        }

        await article.destroy();
        res.status(200).json({ message: 'Artículo eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};