const jwt = require('jsonwebtoken');

// Secret key desde tu .env o puedes definirla directamente aquí
const secretKey = process.env.JWT_SECRET || 'mi_secreto_super_seguro'; // Cambia esto por process.env.JWT_SECRET si tienes tu archivo .env configurado

// Información del emprendimiento
const payload = {
    id: "673bc0da14756a6865c17cea",
	nombre: "zapatitos bonitos",
	infoContacto: "7890483934", // Correo del emprendimiento
};

// Configuración del token
const options = {
    expiresIn: '1h' // El token será válido por 1 hora
};

// Generar el token
const token = jwt.sign(payload, secretKey, options);

// Imprimir el token generado
console.log("Token JWT generado:", token);
