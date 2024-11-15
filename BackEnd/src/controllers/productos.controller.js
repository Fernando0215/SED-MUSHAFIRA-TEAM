const { ObjectId } = require('mongodb');
const { crearProducto } = require('../models/productos.model');
const { validarProducto } = require('../validators/productos.validator');
const { getGridFSBucket } = require('../config/db.config');
const fs = require('fs');

// Crear producto
async function createProducto(req, res) {
    try {
        await validarProducto(req.body);

        const imagenPath = req.file?.path; // Imagen subida temporalmente
        const productoId = await crearProducto(req.body, imagenPath);

        res.status(201).json({ mensaje: 'Producto creado exitosamente', productoId });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
    }
}

// Obtener productos de un emprendimiento
async function obtenerProductos(req, res) {
    try {
        const emprendimientoId = req.usuario.id; // Extraer el id del emprendimiento desde el token JWT

        const db = await connectDB();
        const productosCollection = db.collection('productos');

        // Filtrar productos por emprendimientoId
        const productos = await productosCollection.find({ emprendimientoId }).toArray();

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
}
// Actualizar producto
async function updateProducto(req, res) {
    const productoId = req.params.id;
    const updateData = req.body;
    const emprendimientoIdLogueado = req.usuario.emprendimientoId; // Obtenido del token

    const db = await connectDB();
    const productosCollection = db.collection('productos');

    try {
        // Verificar que el producto pertenece al emprendimiento logueado
        const producto = await productosCollection.findOne({ _id: new ObjectId(productoId) });
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        if (producto.emprendimientoId.toString() !== emprendimientoIdLogueado) {
            return res.status(403).json({ mensaje: "No tienes permiso para modificar este producto" });
        }

        // Actualizar el producto
        const resultado = await productosCollection.updateOne(
            { _id: new ObjectId(productoId) },
            { $set: updateData }
        );

        res.status(200).json({ mensaje: "Producto actualizado correctamente" });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
}

// Eliminar producto
async function deleteProducto(req, res) {
    const productoId = req.params.id;
    const emprendimientoIdLogueado = req.usuario.emprendimientoId; // Obtenido del token

    const db = await connectDB();
    const productosCollection = db.collection('productos');

    try {
        // Verificar que el producto pertenece al emprendimiento logueado
        const producto = await productosCollection.findOne({ _id: new ObjectId(productoId) });
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        if (producto.emprendimientoId.toString() !== emprendimientoIdLogueado) {
            return res.status(403).json({ mensaje: "No tienes permiso para eliminar este producto" });
        }

        // Eliminar el producto
        const resultado = await productosCollection.deleteOne({ _id: new ObjectId(productoId) });
        res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
}

module.exports = {
    createProducto,
    obtenerProductos,
    updateProducto,
    deleteProducto
};
