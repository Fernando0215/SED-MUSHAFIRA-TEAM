const { connectDB, getGridFSBucket } = require('../config/database');
const { validarEmprendimiento } = require('../validators/emprendimientos.validator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');

// Crear un emprendimiento
async function crearEmprendimiento(req, res) {
    const emprendimientoData = req.body;
    const imagenPath = req.file?.path;
    const db = await connectDB();
    const gridFSBucket = getGridFSBucket();
    let imagenEmprendimientoId = null;

    try {
        const existente = await db.collection('emprendimientos').findOne({ correo: emprendimientoData.correo });
        if (existente) {
            throw new Error("Ya existe un emprendimiento con este correo.");
        }

        const hashPassword = crypto.createHash('sha256').update(emprendimientoData.password).digest('hex');
        const passwordExistente = await db.collection('emprendimientos').findOne({ password: hashPassword });
        if (passwordExistente) {
            throw new Error("Ya existe un emprendimiento con esta contraseña. Por favor, elige una diferente.");
        }

        await validarEmprendimiento(emprendimientoData);

        if (imagenPath) {
            const validExtensions = ['.png', '.jpg', '.jpeg'];
            const fileExtension = path.extname(imagenPath).toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
                throw new Error('El archivo debe ser una imagen válida (.png, .jpg, .jpeg)');
            }

            const uploadStream = gridFSBucket.openUploadStream(path.basename(imagenPath));
            fs.createReadStream(imagenPath).pipe(uploadStream);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    imagenEmprendimientoId = uploadStream.id;
                    resolve();
                });
                uploadStream.on('error', (error) => reject(error));
            });

            fs.unlinkSync(imagenPath);
        }

        const hashedPassword = crypto.createHash('sha256').update(emprendimientoData.password).digest('hex');

        const resultado = await db.collection('emprendimientos').insertOne({
            nombreEmprendimiento: emprendimientoData.nombreEmprendimiento,
            imagenEmprendimiento: imagenEmprendimientoId || null,
            infoContacto: emprendimientoData.infoContacto,
            direccion: emprendimientoData.direccion,
            descripcion: emprendimientoData.descripcion,
            correo: emprendimientoData.correo,
            password: hashedPassword
        });

        res.status(201).json({ mensaje: 'Emprendimiento creado exitosamente', emprendimientoId: resultado.insertedId });
    } catch (error) {
        console.error('Error al crear emprendimiento:', error);

        if (imagenEmprendimientoId) {
            await gridFSBucket.delete(imagenEmprendimientoId).catch(err => {
                console.error('Error al eliminar la imagen tras un error:', err);
            });
        }

        res.status(400).json({ mensaje: 'Error al crear emprendimiento', error: error.message });
    }
}

// Obtener perfil del emprendimiento autenticado
async function obtenerPerfilEmprendimiento(req, res) {
    const emprendimientoId = req.usuario.id;
    const db = await connectDB();

    try {
        const emprendimiento = await db.collection('emprendimientos').findOne({ _id: new ObjectId(emprendimientoId) });
        if (!emprendimiento) {
            return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
        }
        res.json(emprendimiento);
    } catch (error) {
        console.error('Error al obtener emprendimiento:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

// Obtener productos del emprendimiento autenticado
async function obtenerProductosDeEmprendimiento(req, res) {
    const emprendimientoId = req.usuario.id;
    const db = await connectDB();

    try {
        const productos = await db.collection('productos').find({ emprendimientoId: new ObjectId(emprendimientoId) }).toArray();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

module.exports = {
    crearEmprendimiento,
    actualizarEmprendimientoAutenticado,
    eliminarEmprendimientoAutenticado,
    obtenerPerfilEmprendimiento,
    obtenerProductosDeEmprendimiento
};
