const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { validarCliente } = require('../validators/clientes.validator');
const { getDB, getGridFSBucket } = require('../config/db.config');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // Subida en memoria

const router = express.Router();

// Ruta para registrar cliente
router.post('/register', upload.single('fotoPerfil'), async (req, res) => {
    const { file } = req;
    const db = getDB();
    const clientesCollection = db.collection('clientes');

    try {
        const newCliente = req.body;

        // Validar datos del cliente
        await validarCliente(newCliente);

        // Verificar si el cliente ya está registrado
        const clienteExistente = await clientesCollection.findOne({ correoElectronico: newCliente.correoElectronico });
        if (clienteExistente) {
            return res.status(409).send({ error: 'El cliente ya está registrado' });
        }

        // Subir imagen al GridFS si existe
        let fotoPerfilId = null;
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
        const hashContrasenna = crypto.createHash('sha256').update(newCliente.contrasenna).digest('hex');

        // Guardar cliente en la base de datos
        const cliente = {
            nombre: newCliente.nombre,
            apellido: newCliente.apellido,
            infoContacto: newCliente.infoContacto,
            correoElectronico: newCliente.correoElectronico,
            contrasenna: hashContrasenna,
            fotoPerfil: fotoPerfilId, // ID de la imagen en GridFS
        };

        const resultado = await clientesCollection.insertOne(cliente);

        res.status(201).send({
            message: 'Cliente registrado exitosamente',
            clienteId: resultado.insertedId,
        });
    } catch (error) {
        console.error('Error al registrar cliente:', error.message);
        res.status(500).send({ error: 'Error al registrar cliente', details: error.message });
    }
});

// Ruta para obtener perfil del cliente
router.get('/perfil/:id', async (req, res) => {
    const { id } = req.params;
    const db = getDB();
    const clientesCollection = db.collection('clientes');

    try {
        const cliente = await clientesCollection.findOne({ _id: new ObjectId(id) });
        if (!cliente) {
            return res.status(404).send({ error: 'Cliente no encontrado' });
        }

        res.status(200).send(cliente);
    } catch (error) {
        console.error('Error al obtener perfil del cliente:', error.message);
        res.status(500).send({ error: 'Error al obtener perfil del cliente', details: error.message });
    }
});

module.exports = router;
