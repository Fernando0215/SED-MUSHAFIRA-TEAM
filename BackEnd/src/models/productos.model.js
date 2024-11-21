const { connectDB, getGridFSBucket } = require('./database');
const fs = require('fs');
const path = require('path');

async function crearProducto(productoData, imagenPath) {
    if (!productoData.nombre || !productoData.descripcion || !productoData.precio || !productoData.emprendimientoId) {
        throw new Error("Todos los campos obligatorios deben estar presentes");
    }

    const db = await connectDB();
    const gridFSBucket = getGridFSBucket();
    let imagenProductoId = null;

    try {
        // Subir imagen a GridFS si existe
        if (imagenPath) {
            const imagenNombre = path.basename(imagenPath);
            const uploadStream = gridFSBucket.openUploadStream(imagenNombre);
            const imageStream = fs.createReadStream(imagenPath);

            imageStream.pipe(uploadStream);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => {
                    imagenProductoId = uploadStream.id;
                    console.log('Imagen subida con ID:', imagenProductoId);
                    resolve();
                });
                uploadStream.on('error', (error) => reject(error));
            });
        }

        // Insertar el producto en la base de datos
        const resultado = await db.collection('productos').insertOne({
            nombre: productoData.nombre,
            descripcion: productoData.descripcion,
            precio: productoData.precio,
            imagenProducto: imagenProductoId,
            emprendimientoId: productoData.emprendimientoId,
            fechaCreacion: new Date()
        });

        console.log('Producto creado con ID:', resultado.insertedId);
        return resultado.insertedId;

    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
}

module.exports = { crearProducto };
