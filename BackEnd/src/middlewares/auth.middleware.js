const { verificarToken: decodificarToken } = require('../utils/jwt.tools');

async function verificarToken(req, res, callback) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.error("Encabezado 'Authorization' no encontrado");
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Encabezado de autorización no proporcionado' }));
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error("Token no encontrado en el encabezado 'Authorization'");
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token no proporcionado en el encabezado' }));
            return;
        }

        console.log('Token recibido:', token);

        // Decodifica el token
        req.usuario = decodificarToken(token);

        console.log('Token decodificado correctamente:', req.usuario);

        await callback();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);

        if (error.name === 'TokenExpiredError') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token expirado' }));
        } else if (error.name === 'JsonWebTokenError') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token inválido' }));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al verificar el token' }));
        }
    }
}

module.exports = { verificarToken };
