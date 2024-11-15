const express = require('express');
const multer = require('multer');
const { subirImagen, obtenerImagen } = require('../controllers/imagenes.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para almacenamiento

// Ruta para subir imagen
router.post('/', upload.single('imagen'), subirImagen);

// Ruta para obtener imagen por ID
router.get('/:id', obtenerImagen);

module.exports = router;
