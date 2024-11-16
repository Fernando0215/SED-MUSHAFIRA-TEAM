// src/config/db.config.js
const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config(); //cargar las variables de entorno

let db;
let gridfsBucket;

// Conexión a la base de datos
async function connectDB() {
    try {
        // Validar que las variables de entorno esenciales están configuradas
        if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
            throw new Error('Las variables de entorno MONGODB_URI o DB_NAME no están configuradas.');
        }

        // Crear el cliente de MongoDB
        const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Configurar la base de datos y GridFS
        db = client.db(process.env.DB_NAME);
        gridfsBucket = new GridFSBucket(db, { bucketName: 'images' });

        console.log(`Conectado a MongoDB: ${process.env.DB_NAME}`);
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1); // Salir si hay un error crítico
    }
}

// Obtener la instancia de la base de datos
function getDB() {
    if (!db) {
        throw new Error('La base de datos no está conectada. Asegúrate de llamar a connectDB primero.');
    }
    return db;
}

// Obtener el bucket de GridFS
function getGridFSBucket() {
    if (!gridfsBucket) {
        throw new Error('El bucket de GridFS no está inicializado. Asegúrate de llamar a connectDB primero.');
    }
    return gridfsBucket;
}

module.exports = { connectDB, getDB, getGridFSBucket };
