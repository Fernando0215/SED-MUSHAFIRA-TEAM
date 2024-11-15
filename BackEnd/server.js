require('dotenv').config();
const http = require('http');
const url = require('url');
const { getDB, connectDB } = require('./src/config/db.config.js');
const { validarEmprendimiento } = require('./src/validators/emprendimientos.validator');

// Función para leer el cuerpo de la solicitud
async function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const db = getDB();

    try {
        // RUTA: Crear cliente
        if (path === '/clientes' && method === 'POST') {
            const newCliente = await parseRequestBody(req);

            if (!newCliente.nombre || !newCliente.apellido || !newCliente.infoContacto || !newCliente.correo || !newCliente.password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Faltan campos requeridos' }));
                return;
            }

            const clientesCollection = db.collection('clientes');
            await clientesCollection.insertOne(newCliente);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente creado exitosamente' }));
        }
        // RUTA: Obtener clientes
        else if (path === '/clientes' && method === 'GET') {
            const clientesCollection = db.collection('clientes');
            const clientes = await clientesCollection.find().toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(clientes));
        }
        // RUTA: Crear emprendimiento
        else if (path === '/emprendimientos' && method === 'POST') {
            try {
                const newEmprendimiento = await parseRequestBody(req);
        
                // Validar emprendimiento usando Joi
                await validarEmprendimiento(newEmprendimiento);
        
                const emprendimientosCollection = db.collection('emprendimientos');
                await emprendimientosCollection.insertOne(newEmprendimiento);
        
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Emprendimiento creado exitosamente' }));
            } catch (error) {
                console.error("Error en creación de emprendimiento:", error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        }
        // RUTA: Obtener emprendimientos
        else if (path === '/emprendimientos' && method === 'GET') {
            const emprendimientosCollection = db.collection('emprendimientos');
            const emprendimientos = await emprendimientosCollection.find().toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(emprendimientos));
        }
        // RUTA: Crear producto
        else if (path === '/productos' && method === 'POST') {
            const newProducto = await parseRequestBody(req);

            if (!newProducto.nombre || !newProducto.descripcion || !newProducto.precio) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Faltan campos requeridos' }));
                return;
            }

            const productosCollection = db.collection('productos');
            await productosCollection.insertOne(newProducto);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Producto creado exitosamente' }));
        }
        // RUTA: Obtener productos
        else if (path === '/productos' && method === 'GET') {
            const productosCollection = db.collection('productos');
            const productos = await productosCollection.find().toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productos));
        }
        // RUTA NO ENCONTRADA
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
});

// Conectar a MongoDB e iniciar el servidor
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('No se pudo conectar a MongoDB:', error);
    });
