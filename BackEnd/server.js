require('dotenv').config();
const http = require('http');
const url = require('url');
const { getDB, connectDB } = require('./src/config/db.config.js');
const { validarEmprendimiento } = require('./src/validators/emprendimientos.validator');
const { validarCliente } = require('./src/validators/clientes.validator');
const { verificarToken } = require('./src/middlewares/auth.middleware');
const { ObjectId } = require('mongodb');


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


    // **Agregar encabezados para CORS**
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos

    // Manejar solicitudes preflight (opcional)
    if (method === 'OPTIONS') {
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return; // Salir después de manejar el preflight
}


    // Nueva lista de palabras prohibidas
const palabrasProhibidas = [
        'tonto', 'idiota', 'imbécil', 'estúpido', 'grosero', 'malnacido', 'infeliz',
        'pendejo', 'cabrón', 'chinga', 'güey', 'mamada', 'pinche', 'culero', 'chingada',
        'boludo', 'pelotudo', 'forro', 'gil', 'puto', 'conchudo', 'chupamedias', 'garca',
        'gilipollas', 'joder', 'coño', 'hijo de puta', 'mamón', 'pringado',
        'gonorrea', 'carechimba', 'huevón', 'malparido', 'chimba', 'ñero',
        'weón', 'culiao', 'conchetumadre', 'maraco', 'puta madre',
        'mamabicho', 'jodón', 'bicho', 'cabrón', 'pendejo',
        'coño', 'gafo', 'pajuo', 'mamaguevo',
        'cerote', 'chucho', 'mulas', 'hueco', 'culero', 'pijudo', 'puñal', 'cachimbon',
        'vergón', 'culiado', 'burro', 'chavacán', 'perra', 'pendejete', 'boludo',
        'culicagado', 'malacate', 'maceta', 'carnicero', 'culicorto', 'pizarrín',
        'lengua floja', 'pistoludo', 'cara de cuete', 'metido', 'maldito'
    
];

    try {
        // RUTA: Crear cliente
        if (path === '/clientes' && method === 'POST') {
            const newCliente = await parseRequestBody(req);

            if (!newCliente.nombre || !newCliente.apellido || !newCliente.infoContacto || !newCliente.correoElectronico || !newCliente.contrasenna) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Faltan campos requeridos' }));
                return;
            }

            await validarCliente(newCliente);

            const clientesCollection = db.collection('clientes');
            await clientesCollection.insertOne(newCliente);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente creado exitosamente' }));
        }

        // RUTA: Obtener perfil del cliente autenticado
        else if (path === '/clientes/perfil' && method === 'GET') {
    await verificarToken(req, res, async () => {
        try {
            const clienteId = new ObjectId(req.usuario.id); // Convertir el ID en ObjectId
            const cliente = await db.collection('clientes').findOne({ _id: clienteId });

            if (!cliente) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cliente));
        } catch (error) {
            console.error('Error al obtener el perfil del cliente:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno del servidor' }));
        }
    });
}

        // RUTA: Crear emprendimiento
        else if (path === '/emprendimientos' && method === 'POST') {
            const newEmprendimiento = await parseRequestBody(req);

            await validarEmprendimiento(newEmprendimiento);

            const emprendimientosCollection = db.collection('emprendimientos');
            await emprendimientosCollection.insertOne(newEmprendimiento);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Emprendimiento creado exitosamente' }));
        }

        // RUTA: Obtener perfil del emprendimiento autenticado
        else if (path === '/emprendimientos/perfil' && method === 'GET') {
            await verificarToken(req, res, async () => {
                const emprendimientoId = req.usuario.id;
                const emprendimiento = await db.collection('emprendimientos').findOne({ _id: emprendimientoId });

                if (!emprendimiento) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(emprendimiento));
            });
        }

        // RUTA: Obtener todos los emprendimientos
        else if (path === '/emprendimientos' && method === 'GET') {
            console.log("Solicitud recibida: GET /emprendimientos");
            const emprendimientosCollection = db.collection('emprendimientos');
            const emprendimientos = await emprendimientosCollection.find().toArray();

            const emprendimientosUnicos = Array.from(
                new Map(emprendimientos.map(emp => [emp.nombreEmprendimiento, emp])).values()
            );


            console.log("Emprendimientos enviados:", emprendimientos);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(emprendimientosUnicos));
        }

        // RUTA: Obtener productos de un emprendimiento específico
        else if (path.startsWith('/emprendimientos/') && path.endsWith('/productos') && method === 'GET') {
            const parts = path.split('/');
            const emprendimientoId = parts[2];

            const productosCollection = db.collection('productos');
            const productos = await productosCollection.find({ emprendimientoId }).toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productos));
        }

        // Ruta: Obtener productos de un emprendimiento autenticado
        else if (path === '/productos' && method === 'GET') {
            await verificarToken(req, res, async () => {
                const emprendimientoId = req.usuario.id; // ID del emprendimiento autenticado
                console.log("ID del emprendimiento autenticado:", emprendimientoId);

                const productosCollection = db.collection('productos');

                // Asegúrate de comparar emprendimientoId como string
                const productos = await productosCollection.find({ emprendimientoId: emprendimientoId }).toArray();
                
                console.log("Productos encontrados:", productos);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(productos));
            });
        }


        // RUTA: Ver detalle de un producto específico
        else if (path.startsWith('/productos/') && method === 'GET') {
    const parts = path.split('/');
    const productoId = parts[2];

    const productosCollection = db.collection('productos');
    const producto = await productosCollection.findOne({ _id: productoId });

    if (!producto) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Producto no encontrado' }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(producto));
}

// RUTA: Crear producto
else if (path === '/productos' && method === 'POST') {
    await verificarToken(req, res, async () => {
        const newProducto = await parseRequestBody(req);

        if (!newProducto.nombre || !newProducto.descripcion || !newProducto.precio) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Faltan campos requeridos' }));
            return;
        }

        newProducto.emprendimientoId = req.usuario.id; // Asociar el producto al emprendimiento autenticado
        const productosCollection = db.collection('productos');
        await productosCollection.insertOne(newProducto);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Producto creado exitosamente' }));
    });
}


// RUTA: Crear comentario en un emprendimiento
// RUTA: Crear comentario en un emprendimiento
else if (path.startsWith('/emprendimientos/') && path.endsWith('/comentarios') && method === 'POST') {
    await verificarToken(req, res, async () => {
        const parts = path.split('/');
        const emprendimientoId = parts[2];

        // Validar que el emprendimientoId sea válido y exista
        if (!ObjectId.isValid(emprendimientoId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El ID del emprendimiento no es válido' }));
            return;
        }

        const emprendimiento = await db.collection('emprendimientos').findOne({ _id: new ObjectId(emprendimientoId) });
        if (!emprendimiento) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
            return;
        }

        const newComentario = await parseRequestBody(req);

        if (!newComentario.contenido || newComentario.contenido.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El comentario no puede estar vacío' }));
            return;
        }

        const comentariosCollection = db.collection('comentarios');
        const clientesCollection = db.collection('clientes');

        // Limpiar palabras prohibidas
        const palabras = newComentario.contenido.split(/\s+/);
        let tienePalabrasProhibidas = false;

        const contenidoFiltrado = palabras
            .map(palabra => {
                if (palabrasProhibidas.includes(palabra.toLowerCase())) {
                    tienePalabrasProhibidas = true;
                    return '****';
                }
                return palabra;
            })
            .join(' ');

        // Manejar el contador del cliente si hay palabras prohibidas
        const clienteId = req.usuario.id;
        const cliente = await clientesCollection.findOne({ _id: new ObjectId(clienteId) });

        if (tienePalabrasProhibidas) {
            const nuevoContador = (cliente.contadorComentariosMalos || 0) + 1;

            // Actualizar el contador en la base de datos
            await clientesCollection.updateOne(
                { _id: new ObjectId(clienteId) },
                { $set: { contadorComentariosMalos: nuevoContador } }
            );

            // Manejar las sanciones según el número de incidencias
            if (nuevoContador === 1) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Has sido bloqueado temporalmente de comentar por 1 hora debido a lenguaje inapropiado'
                }));
                return;
            } else if (nuevoContador === 2) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Has sido bloqueado temporalmente de comentar por 3 días debido a reincidencia'
                }));
                return;
            } else if (nuevoContador >= 3) {
                // Crear alerta para el administrador
                const adminAlertsCollection = db.collection('admin_alerts');
                await adminAlertsCollection.insertOne({
                    clienteId: clienteId,
                    comentario: contenidoFiltrado,
                    emprendimientoId: emprendimientoId,
                    timestamp: new Date()
                });

                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Has sido reportado al administrador. Tu cuenta podría ser eliminada'
                }));
                return;
            }
        }

        // Guardar el comentario
        await comentariosCollection.insertOne({
            clienteId: clienteId,
            emprendimientoId: emprendimientoId,
            contenido: contenidoFiltrado,
            timestamp: new Date()
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Comentario creado exitosamente' }));
    });
}

// RUTA: Obtener comentarios de un emprendimiento específico
else if (path.startsWith('/emprendimientos/') && path.endsWith('/comentarios') && method === 'GET') {
    const parts = path.split('/');
    const emprendimientoId = parts[2];

    const comentariosCollection = db.collection('comentarios');
    const comentarios = await comentariosCollection.find({ emprendimientoId: emprendimientoId }).toArray();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comentarios));
}

// RUTA: Administrador - Ver comentarios reportados
else if (path === '/admin/comentarios-reportados' && method === 'GET') {
    const adminAlertsCollection = db.collection('admin_alerts');
    const reportes = await adminAlertsCollection.find().toArray();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reportes));
}

// RUTA: Administrador - Eliminar cliente reportado
else if (path.startsWith('/admin/clientes/') && method === 'DELETE') {
    const parts = path.split('/');
    const clienteId = parts[3];

    const clientesCollection = db.collection('clientes');
    const resultado = await clientesCollection.deleteOne({ _id: new ObjectId(clienteId) });

    if (resultado.deletedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Cliente eliminado exitosamente' }));
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
