import { Tag, Article } from '../models/relaciones.js';

export const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const newTag = await Tag.create({ name });
        res.status(201).json({ message: 'Etiqueta creada correctamente.', tag: newTag });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El nombre de la etiqueta ya existe.' });
        }
        res.status(500).json({ message: 'Error al crear la etiqueta.', error: error.message });
    }
};

export const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las etiquetas.', error: error.message });
    }
};

export const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByPk(id, {
            include: [{ model: Article, as: 'articles' }]
        });
        if (!tag) {
            return res.status(404).json({ message: 'Etiqueta no encontrada.' });
        }
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la etiqueta.', error: error.message });
    }
};

export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({ message: 'Etiqueta no encontrada.' });
        }
        await tag.update({ name });
        res.status(200).json({ message: 'Etiqueta actualizada correctamente.', tag });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El nombre de la etiqueta ya existe.' });
        }
        res.status(500).json({ message: 'Error al actualizar la etiqueta.', error: error.message });
    }
};

export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({ message: 'Etiqueta no encontrada.' });
        }
        await tag.destroy();
        res.status(200).json({ message: 'Etiqueta eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la etiqueta.', error: error.message });
    }
};