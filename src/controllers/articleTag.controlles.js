import { Article, ArticleTag, Tag } from '../models/relaciones.js';

export const addTagToArticle = async (req, res) => {
    try {
        const { articleId, tagName } = req.body;

        if (!articleId || !tagName) {
            return res.status(400).json({ message: 'Se requieren el ID del artículo y el nombre de la etiqueta.' });
        }

        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        const [tag, created] = await Tag.findOrCreate({
            where: { name: tagName.toLowerCase().replace(/\s/g, '-') }
        });

        if (article.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tiene permisos para modificar este artículo.' });
        }

        await article.addTag(tag);

        res.status(201).json({ message: 'Etiqueta agregada al artículo exitosamente.', article, tag });
    } catch (error) {
        console.error('Error al agregar etiqueta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

export const removeTagFromArticle = async (req, res) => {
    try {
        const { articleTagId } = req.params;

        const articleTag = await ArticleTag.findByPk(articleTagId);
        if (!articleTag) {
            return res.status(404).json({ message: 'Relación de artículo/etiqueta no encontrada.' });
        }

        const article = await Article.findByPk(articleTag.article_id);
        if (article.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tiene permisos para modificar este artículo.' });
        }

        await articleTag.destroy();

        res.status(200).json({ message: 'Etiqueta removida del artículo exitosamente.' });
    } catch (error) {
        console.error('Error al remover etiqueta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};