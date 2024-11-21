const { connectDB } = require('./database');

async function crearEmprendimiento(emprendimientoData) {
  // Validación de los campos requeridos
  if (
    !emprendimientoData.nombreEmprendimiento ||
    !emprendimientoData.infoContacto ||
    !emprendimientoData.direccion ||
    !emprendimientoData.descripcion ||
    !emprendimientoData.correo ||
    !emprendimientoData.password
  ) {
    throw new Error("Todos los campos obligatorios deben estar presentes");
  }

  const db = await connectDB();
  try {
    // Inserta el documento con los campos definidos
    const resultado = await db.collection('emprendimientos').insertOne({
      nombreEmprendimiento: emprendimientoData.nombreEmprendimiento,
      imagenEmprendimiento: emprendimientoData.imagenEmprendimiento || "", // Ruta de la imagen de perfil
      bannerImage: emprendimientoData.bannerImage || "", // Ruta de la imagen del banner
      infoContacto: emprendimientoData.infoContacto,
      direccion: emprendimientoData.direccion,
      descripcion: emprendimientoData.descripcion,
      correo: emprendimientoData.correo,
      password: emprendimientoData.password,
    });
    console.log('Emprendimiento creado con ID:', resultado.insertedId);
    return resultado.insertedId;
  } catch (error) {
    console.error('Error al crear emprendimiento:', error);
    throw error;
  }
}
