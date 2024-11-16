// src/controllers/imagenes.controller.js
const fs = require('fs');
const { getGridFSBucket } = require('../config/db.config');

// Subir imagen
async function subirImagen(req, res) {
    const { file } = req;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    const uploadStream = getGridFSBucket().openUploadStream(file.originalname);
    fs.createReadStream(file.path).pipe(uploadStream);

    uploadStream.on('finish', () => {
        fs.unlinkSync(file.path); // Elimina el archivo temporal
        res.status(201).send({ message: 'Imagen subida exitosamente' });
    });

    uploadStream.on('error', (error) => {
        res.status(500).send({ error: 'Error al subir la imagen', details: error });
    });
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
