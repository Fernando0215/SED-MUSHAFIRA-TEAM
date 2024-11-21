const fs = require('fs');
const path = require('path');

// Directorio para guardar imágenes
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Crear directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Controlador para subir imágenes
async function subirImagen(req, res, fields, files) {
    try {
        const file = files.fotoPerfil; // Campo del formulario con el archivo

        if (!file) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No se subió ninguna imagen' }));
            return;
        }

        // Mover archivo desde ruta temporal al directorio final
        const newFilePath = path.join(UPLOADS_DIR, file.newFilename);
        fs.renameSync(file.filepath, newFilePath);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Imagen subida con éxito', ruta: `/uploads/${file.newFilename}` }));
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno al subir imagen' }));
    }
}

// Controlador para obtener imágenes por nombre
async function obtenerImagen(req, res, fileName) {
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Imagen no encontrada' }));
        return;
    }

    // Leer y servir el archivo
    const fileStream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Cambia el Content-Type si es necesario
    fileStream.pipe(res);
}

module.exports = {
    subirImagen,
    obtenerImagen,
};
