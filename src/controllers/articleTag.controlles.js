import { Article, ArticleTag, Tag } from '../models/relaciones.js';

export const addTagToArticle = async (req, res) => {
    try {
        const { articleId, tagId, tagName } = req.body;

        if (!articleId || (!tagId && !tagName)) {
            return res.status(400).json({ message: 'Se requiere el ID del artículo y el ID o nombre de la etiqueta.' });
        }

        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        let tag;
        if (tagId) {
            tag = await Tag.findByPk(tagId);
            if (!tag) {
                return res.status(404).json({ message: 'Etiqueta no encontrada.' });
            }
        } else {
            [tag] = await Tag.findOrCreate({
                where: { name: tagName.toLowerCase() }
            });
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
        
        await articleTag.destroy();
        
        res.status(200).json({ message: 'Etiqueta removida del artículo exitosamente.' });
    } catch (error) {
        console.error('Error al remover etiqueta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};