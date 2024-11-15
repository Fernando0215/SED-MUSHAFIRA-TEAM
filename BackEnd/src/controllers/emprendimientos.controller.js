const { connectDB, getGridFSBucket } = require('../config/database');
const { validarEmprendimiento } = require('../validators/emprendimientos.validator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Crear un emprendimiento
async function crearEmprendimiento(req, res) {
    const emprendimientoData = req.body;
    const imagenPath = req.file?.path; // Imagen subida temporalmente
    const db = await connectDB();
    const gridFSBucket = getGridFSBucket();
    let imagenEmprendimientoId = null;

    try {

        const existente = await db.collection('emprendimientos').findOne({ correo: emprendimientoData.correo });
        if (existente) {
            throw new Error("Ya existe un emprendimiento con este correo.");
        }

        // Verificar si ya existe un emprendimiento con la misma contraseña
        const hashPassword = crypto.createHash('sha256').update(emprendimientoData.password).digest('hex');
        const passwordExistente = await db.collection('emprendimientos').findOne({ password: hashPassword });
        if (passwordExistente) {
            throw new Error("Ya existe un emprendimiento con esta contraseña. Por favor, elige una diferente.");
        }
        // Validar datos de entrada
        await validarEmprendimiento(emprendimientoData);

        // Manejo de imagen si se proporciona
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

            fs.unlinkSync(imagenPath); // Eliminar archivo temporal
        }

        // Hash de la contraseña
        const hashedPassword = crypto.createHash('sha256').update(emprendimientoData.password).digest('hex');

        // Guardar el emprendimiento
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

// Actualizar emprendimiento autenticado
async function actualizarEmprendimientoAutenticado(req, res) {
    const updates = req.body;
    const imagenPath = req.file?.path; // Imagen subida temporalmente
    const emprendimientoId = req.usuario.emprendimientoId; // ID del emprendimiento logueado
    const db = await connectDB();
    const gridFSBucket = getGridFSBucket();
    let nuevaImagenId = null;

    try {
        // Validar datos de entrada
        if (Object.keys(updates).length === 0 && !imagenPath) {
            return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar' });
        }

        // Manejo de nueva imagen si se proporciona
        if (imagenPath) {
            const uploadStream = gridFSBucket.openUploadStream(path.basename(imagenPath));
            fs.createReadStream(imagenPath).pipe(uploadStream);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    nuevaImagenId = uploadStream.id;
                    resolve();
                });
                uploadStream.on('error', (error) => reject(error));
            });

            fs.unlinkSync(imagenPath); // Eliminar archivo temporal

            updates.imagenEmprendimiento = nuevaImagenId;
        }

        // Actualizar emprendimiento
        const resultado = await db.collection('emprendimientos').findOneAndUpdate(
            { _id: emprendimientoId },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!resultado.value) {
            return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
        }

        // Eliminar imagen anterior si se actualizó
        if (nuevaImagenId && resultado.value.imagenEmprendimiento) {
            await gridFSBucket.delete(resultado.value.imagenEmprendimiento).catch(err => {
                console.error('Error al eliminar imagen anterior:', err);
            });
        }

        res.status(200).json({ mensaje: 'Emprendimiento actualizado correctamente', emprendimiento: resultado.value });
    } catch (error) {
        console.error('Error al actualizar emprendimiento:', error);
        if (nuevaImagenId) {
            await gridFSBucket.delete(nuevaImagenId).catch(err => {
                console.error('Error al eliminar nueva imagen tras un error:', err);
            });
        }
        res.status(500).json({ mensaje: 'Error al actualizar emprendimiento', error: error.message });
    }
}

// Eliminar emprendimiento autenticado
async function eliminarEmprendimientoAutenticado(req, res) {
    const emprendimientoId = req.usuario.emprendimientoId; // ID del emprendimiento logueado
    const db = await connectDB();
    const gridFSBucket = getGridFSBucket();

    try {
        const emprendimiento = await db.collection('emprendimientos').findOne({ _id: emprendimientoId });

        if (!emprendimiento) {
            return res.status(404).json({ mensaje: 'Emprendimiento no encontrado' });
        }

        // Eliminar imagen de GridFS si existe
        if (emprendimiento.imagenEmprendimiento) {
            await gridFSBucket.delete(emprendimiento.imagenEmprendimiento).catch(err => {
                console.error('Error al eliminar imagen:', err);
            });
        }

        // Eliminar emprendimiento
        const resultado = await db.collection('emprendimientos').deleteOne({ _id: emprendimientoId });

        if (resultado.deletedCount === 0) {
            return res.status(500).json({ mensaje: 'No se pudo eliminar el emprendimiento' });
        }

        res.status(200).json({ mensaje: 'Emprendimiento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar emprendimiento:', error);
        res.status(500).json({ mensaje: 'Error al eliminar emprendimiento', error: error.message });
    }
}

module.exports = {
    crearEmprendimiento,
    actualizarEmprendimientoAutenticado,
    eliminarEmprendimientoAutenticado
};
