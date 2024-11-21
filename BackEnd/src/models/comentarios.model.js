const { connectDB } = require('./database');

async function crearComentario(comentarioData) {
    const db = await connectDB();

    const comentario = {
        emprendimientoId: comentarioData.emprendimientoId,
        clienteId: comentarioData.clienteId,
        comentario: comentarioData.comentario,
        fecha: new Date()
    };

    const resultado = await db.collection('comentarios').insertOne(comentario);
    return resultado.insertedId;
}

module.exports = { crearComentario };
