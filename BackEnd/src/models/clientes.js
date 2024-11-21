const { connectDB, getGridFSBucket } = require('./database');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Para hashear la contraseña
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink); // Promisify para eliminar archivos

async function crearCliente(clienteData, imagenPath) {
  // Validación de los campos requeridos
  if (
    !clienteData.nombre ||
    !clienteData.apellido ||
    !clienteData.infoContacto ||
    !clienteData.correoElectronico ||
    !clienteData.contrasenna
  ) {
    throw new Error("Todos los campos obligatorios deben estar presentes");
  }

  const db = await connectDB();
  const gridFSBucket = getGridFSBucket();
  let fotoPerfilId = null;

  try {
    // Validar y subir la imagen si se proporciona
    if (imagenPath) {
      // Validación del tipo de archivo
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const fileExtension = path.extname(imagenPath).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        throw new Error("El archivo debe ser una imagen (.png, .jpg, .jpeg)");
      }

      const imagenNombre = path.basename(imagenPath);
      const uploadStream = gridFSBucket.openUploadStream(imagenNombre);
      const imageStream = fs.createReadStream(imagenPath);

      // Subir la imagen a GridFS
      imageStream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          fotoPerfilId = uploadStream.id; // Guardar el ID de la imagen
          console.log('Imagen subida con ID:', fotoPerfilId);
          resolve();
        });
        uploadStream.on('error', (error) => reject(error));
      });

      // Eliminar el archivo temporal después de subirlo
      await unlinkAsync(imagenPath);
    }

    // Hash de la contraseña antes de guardarla
    const hashContrasenna = crypto
      .createHash('sha256')
      .update(clienteData.contrasenna)
      .digest('hex');

    // Inserta el cliente con los campos definidos
    const resultado = await db.collection('clientes').insertOne({
      nombre: clienteData.nombre,
      apellido: clienteData.apellido,
      fotoPerfil: fotoPerfilId, // ID de la imagen en GridFS
      infoContacto: clienteData.infoContacto,
      correoElectronico: clienteData.correoElectronico,
      contrasenna: hashContrasenna, // Guardar la contraseña hasheada
    });

    console.log('Cliente creado con ID:', resultado.insertedId);
    return resultado.insertedId;
  } catch (error) {
    console.error('Error al crear cliente:', error);

    // Eliminar la imagen si se subió y ocurre un error después
    if (fotoPerfilId) {
      await gridFSBucket.delete(fotoPerfilId).catch(err => {
        console.error('Error al eliminar la imagen subida tras error:', err);
      });
    }
    throw error;
  }
}

module.exports = { crearCliente };
