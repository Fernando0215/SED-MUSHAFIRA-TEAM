// src/controllers/imagenes.controller.js
const fs = require('fs');
const { getGridFSBucket } = require('../config/db.config');

// Subir imagen
// Subir imagen
async function subirImagen(req, res) {
    const { file } = req;
    if (!file) {
        return res.status(400).send({ error: "No se subió ningún archivo." });
    }

    try {
        const gridFSBucket = getGridFSBucket();
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
        });

        uploadStream.end(file.buffer);

        uploadStream.on('finish', () => {
            res.status(201).send({
                message: 'Imagen subida exitosamente',
                fileId: uploadStream.id, // Devuelve el ID de la imagen subida
            });
        });

        uploadStream.on('error', (error) => {
            console.error('Error al subir la imagen:', error);
            res.status(500).send({ error: 'Error al subir la imagen', details: error.message });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Error interno del servidor', details: error.message });
    }
}


// Obtener imagen por ID
async function obtenerImagen(req, res) {
    const { id } = req.params;
    const downloadStream = getGridFSBucket().openDownloadStreamByName(id);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.status(404).send("Imagen no encontrada.");
    });

    downloadStream.on('end', () => {
        res.end();
    });
}

module.exports = { subirImagen, obtenerImagen };
