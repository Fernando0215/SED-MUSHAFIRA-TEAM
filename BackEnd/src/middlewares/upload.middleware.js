const multer = require('multer');

// Configuración básica de multer
const upload = multer({
    dest: 'uploads/', // Carpeta temporal donde se guardarán los archivos subidos
    limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de archivo: 5MB
});

// Uso en una ruta
app.post('/upload', upload.single('imagen'), (req, res) => {
    try {
        const file = req.file; // El archivo subido estará disponible aquí
        if (!file) {
            return res.status(400).send('No se subió ningún archivo');
        }
        res.status(200).send({ message: 'Archivo subido con éxito', file });
    } catch (error) {
        res.status(500).send({ error: 'Error al subir el archivo', details: error.message });
    }
});
