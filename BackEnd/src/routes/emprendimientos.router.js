const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { validarEmprendimiento } = require('../validators/emprendimientos.validator');
const { getDB, getGridFSBucket } = require('../config/db.config');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // Subida en memoria

const router = express.Router();

// Ruta para registrar cliente
router.post('/register', upload.single('imagenEmprendimiento'), async (req, res) => {
    const { file } = req;
    const db = getDB();
    const emprendimientosCollection = db.collection('emprendimientos');

    try {
        const newEmprendimiento = req.body;

        // Validar datos del cliente
        await validarEmprendimiento(newEmprendimiento);

        // Verificar si el cliente ya está registrado
        const emprendimientoExistente = await emprendimientosCollection.findOne({ correo: newEmprendimiento.correo });
        if (emprendimientoExistente) {
            return res.status(409).send({ error: 'El emprendimiento ya está registrado' });
        }

        // Subir imagen al GridFS si existe
        let imagenEmprendimientoId = null;
        if (file) {
            const gridFSBucket = getGridFSBucket();
            const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
                contentType: file.mimetype,
            });
            uploadStream.end(file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    fotoPerfilId = uploadStream.id; // Guardar el ID de la imagen
                    resolve();
                });
                uploadStream.on('error', reject);
            });
        }

        // Hash de la contraseña
        const hashPassword = crypto.createHash('sha256').update(newEmprendimiento.password).digest('hex');

        // Guardar cliente en la base de datos
        const emprendimiento = {
            nombreEmprendimiento: newEmprendimiento.nombreEmprendimiento,
            infoContacto: newEmprendimiento.infoContacto,
            correo: newEmprendimiento.correo,
            imagenEmprendimiento: newEmprendimiento.imagenEmprendimiento,
            direccion: newEmprendimiento.direccion,
            password: hashPassword,
            descripcion: newEmprendimiento.descripcion // ID de la imagen en GridFS
            // ID de la imagen en GridFS
        };

        const resultado = await clientesCollection.insertOne(emprendimiento);

        res.status(201).send({
            message: 'Emprendimiento solicitud registrado exitosamente',
            clienteId: resultado.insertedId,
        });
    } catch (error) {
        console.error('Error al registrar emprendimiento:', error.message);
        res.status(500).send({ error: 'Error al registrar emprendimiento', details: error.message });
    }
});

module.exports = emprendimientosRouter;
