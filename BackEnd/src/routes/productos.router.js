const express = require('express');
const { createProducto, obtenerProductos, updateProducto, deleteProducto } = require('../controllers/productos.controller');
const { autenticarUsuario } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para imágenes
const router = express.Router();

// Crear producto
router.post('/', autenticarUsuario, upload.single('imagen'), createProducto);

// Obtener productos del emprendimiento logueado
router.get('/', autenticarUsuario, obtenerProductos);

// Actualizar producto del emprendimiento logueado
router.put('/:id', autenticarUsuario, updateProducto);

// Eliminar producto del emprendimiento logueado
router.delete('/:id', autenticarUsuario, deleteProducto);

module.exports = router;
