const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db.config');
const bcrypt = require('bcrypt');

// Función para crear un nuevo cliente
async function createCliente(req, res) {
    const clienteData = req.body;

    // Validación de campos requeridos
    if (
        !clienteData.nombre ||
        !clienteData.apellido ||
        !clienteData.infoContacto ||
        !clienteData.correoElectronico ||
        !clienteData.contrasenna
    ) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes" });
    }

    const db = await connectDB();
    const clientesCollection = db.collection('clientes');

    try {
        // Verificar si el cliente ya existe (por correo electrónico o contacto)
        const clienteExistente = await clientesCollection.findOne({
            $or: [
                { correoElectronico: clienteData.correoElectronico },
                { infoContacto: clienteData.infoContacto }
            ]
        });

        if (clienteExistente) {
            return res.status(400).json({ error: "Cliente ya registrado con este correo o información de contacto" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(clienteData.contrasenna, 10);

        // Insertar el nuevo cliente en la base de datos
        const resultado = await clientesCollection.insertOne({
            nombre: clienteData.nombre,
            apellido: clienteData.apellido,
            fotoPerfil: clienteData.fotoPerfil || "",
            infoContacto: clienteData.infoContacto,
            correoElectronico: clienteData.correoElectronico,
            contrasenna: hashedPassword, // Guardar contraseña encriptada
        });

        res.status(201).json({ message: 'Cliente registrado con éxito', clienteId: resultado.insertedId });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Función para actualizar datos del cliente loggeado
async function updateClienteLoggeado(req, res) {
    const clienteId = req.usuario.id; // Extraemos el ID del token
    const updateData = req.body;

    const db = await connectDB();
    const clientesCollection = db.collection('clientes');

    try {
        const resultado = await clientesCollection.updateOne(
            { _id: new ObjectId(clienteId) },
            { $set: updateData }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Función para eliminar el cliente loggeado
async function deleteClienteLoggeado(req, res) {
    const clienteId = req.usuario.id; // Extraemos el ID del token

    const db = await connectDB();
    const clientesCollection = db.collection('clientes');

    try {
        const resultado = await clientesCollection.deleteOne({ _id: new ObjectId(clienteId) });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
    createCliente,
    updateClienteLoggeado,
    deleteClienteLoggeado,
};