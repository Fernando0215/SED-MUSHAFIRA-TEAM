const jwt = require('jsonwebtoken');

// Clave secreta (debe estar en tu archivo .env para mayor seguridad)
const SECRET_KEY = process.env.JWT_SECRET || 'mi_secreto_super_seguro';
const EXPIRATION_TIME = process.env.JWT_EXPIRATION || '3h'; // Tiempo de expiración del token

/**
 * Genera un token JWT
 * @param {Object} payload - Información que se incluirá en el token
 * @returns {String} - Token JWT generado
 */
function generarToken(payload) {
    try {
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw new Error('No se pudo generar el token');
    }
}

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} - Información decodificada del token
 */
function verificarToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        throw new Error('Token inválido o expirado');
    }
}

module.exports = {
    generarToken,
    verificarToken,
};
