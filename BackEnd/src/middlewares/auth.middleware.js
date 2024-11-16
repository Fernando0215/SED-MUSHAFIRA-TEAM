const jwt = require('jsonwebtoken');

async function verificarToken(req, res, callback) {
    try {
        // Obtener el encabezado de autorización
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Encabezado de autorización no proporcionado' }));
            return;
        }

        // Comprobar que el encabezado tiene el formato correcto
        const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token no proporcionado en el encabezado' }));
            return;
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validar que el token tenga las propiedades necesarias
        if (!decoded.id) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El token no contiene un ID válido' }));
            return;
        }

        // Agregar los datos decodificados a la solicitud
        req.usuario = decoded;

        // Continuar con la ejecución del callback
        await callback();
    } catch (error) {
        // Manejo de errores específicos
        if (error.name === 'TokenExpiredError') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token expirado' }));
            return;
        }
        if (error.name === 'JsonWebTokenError') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token inválido' }));
            return;
        }

        // Manejo de otros errores
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno al verificar el token' }));
    }
}

module.exports = { verificarToken };
