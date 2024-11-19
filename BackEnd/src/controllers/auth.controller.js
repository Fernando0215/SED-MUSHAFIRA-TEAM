require('dotenv').config(); // Cargar variables de entorno desde .env
const { connectDB } = require('../config/db.config'); // Conexión a la base de datos
const bcrypt = require('bcrypt'); // Para el hashing de contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro'; // Llave secreta para JWT

// Función de login
async function login(req, res) {
    try {
        const body = await parseRequestBody(req); // Parsear el cuerpo de la solicitud
        const { correoElectronico, contrasenna } = body;

        if (!correoElectronico || !contrasenna) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Correo y contraseña son obligatorios' }));
            return;
        }

        const db = await connectDB();

        // Buscar cliente
        const cliente = await db.collection('clientes').findOne({ correoElectronico });
        if (cliente && await bcrypt.compare(contrasenna, cliente.contrasenna)) {
            const token = jwt.sign({ id: cliente._id, role: 'cliente' }, JWT_SECRET, { expiresIn: '1h' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Cliente autenticado',
                token,
                role: 'cliente',
                redirectUrl: '/home-client' // URL para cliente
            }));
            return;
        }

        // Buscar emprendimiento
        const emprendimiento = await db.collection('emprendimientos').findOne({ correo: correoElectronico });
        if (emprendimiento && await bcrypt.compare(contrasenna, emprendimiento.password)) {
            const token = jwt.sign({ id: emprendimiento._id, role: 'emprendedor' }, JWT_SECRET, { expiresIn: '1h' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Emprendedor autenticado',
                token,
                role: 'emprendedor',
                redirectUrl: '/home-emprendedor' // URL para emprendedor
            }));
            return;
        }

        // Si no se encuentra en ninguna colección
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Usuario no encontrado. Por favor regístrate.' }));
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno en el servidor' }));
    }
}

// Función de registro
async function register(req, res) {
    try {
        const body = await parseRequestBody(req); // Parsear el cuerpo de la solicitud
        const { role, nombre, apellido, correoElectronico, contrasenna, nombreEmprendimiento, descripcion } = body;

        if (!role || !correoElectronico || !contrasenna) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todos los campos obligatorios deben estar presentes' }));
            return;
        }

        const db = await connectDB();

        // Hashea la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(contrasenna, 10);

        if (role === 'cliente') {
            await db.collection('clientes').insertOne({
                nombre,
                apellido,
                correoElectronico,
                contrasenna: hashedPassword,
            });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente registrado exitosamente' }));
        } else if (role === 'emprendedor') {
            await db.collection('emprendimientos').insertOne({
                nombreEmprendimiento,
                correo: correoElectronico,
                descripcion,
                password: hashedPassword,
            });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Emprendedor registrado exitosamente' }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Rol inválido' }));
        }
    } catch (error) {
        console.error('Error en registro:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno en el servidor' }));
    }
}

// Función para parsear el cuerpo de la solicitud
async function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Error al parsear el cuerpo de la solicitud'));
            }
        });
    });
}

module.exports = {
    login,
    register,
};
