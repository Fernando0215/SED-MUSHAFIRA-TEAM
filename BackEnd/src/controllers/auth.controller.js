const { connectDB } = require('../config/db.config'); // Conexión a la base de datos
const bcrypt = require('bcrypt'); // Para el hashing de contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT
const { JWT_SECRET } = require('../config/env.config'); // Llave secreta para el JWT

// Función de login
async function login(req, res) {
  const { correoElectronico, contrasenna } = req.body;

  if (!correoElectronico || !contrasenna) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const db = await connectDB();

  try {
    // Buscar cliente
    const cliente = await db.collection('clientes').findOne({ correo: correoElectronico });
    if (cliente && await bcrypt.compare(contrasenna, cliente.contrasenna)) {
      const token = jwt.sign({ id: cliente._id, role: 'cliente' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: 'Cliente autenticado', token, role: 'cliente' });
    }

    // Buscar emprendimiento
    const emprendimiento = await db.collection('emprendimientos').findOne({ correo: correoElectronico });
    if (emprendimiento && await bcrypt.compare(contrasenna, emprendimiento.password)) {
      const token = jwt.sign({ id: emprendimiento._id, role: 'emprendedor' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: 'Emprendedor autenticado', token, role: 'emprendedor' });
    }

    return res.status(404).json({ error: 'Usuario no encontrado. Por favor regístrate.' });
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
}


// Función de registro (por si quieres manejar el registro aquí también)
async function register(req, res) {
  const { role, nombre, apellido, correoElectronico, contrasenna } = req.body;

  if (!role || !correoElectronico || !contrasenna) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
  }

  const db = await connectDB();

  try {
    // Hashea la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(contrasenna, 10);

    if (role === 'cliente') {
      await db.collection('clientes').insertOne({
        nombre,
        apellido,
        correoElectronico,
        contrasenna: hashedPassword,
      });
      return res.json({ message: 'Cliente registrado exitosamente' });
    } else if (role === 'emprendedor') {
      await db.collection('emprendimientos').insertOne({
        nombre: req.body.nombreEmprendimiento,
        correo: correoElectronico,
        password: hashedPassword,
      });
      return res.json({ message: 'Emprendedor registrado exitosamente' });
    } else {
      return res.status(400).json({ error: 'Rol inválido' });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error interno en el servidor' });
  }
}

module.exports = {
  login,
  register,
};
