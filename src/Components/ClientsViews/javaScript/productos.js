document.addEventListener("DOMContentLoaded", async () => {
    const emprendimientoId = new URLSearchParams(window.location.search).get("id");

    if (!emprendimientoId) {
        alert("No se encontró el ID del emprendimiento.");
        return;
    }

    try {
        // Cargar información del emprendimiento
        const emprendimientoResponse = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}`);
        const emprendimiento = await emprendimientoResponse.json();

        const emprendimientoInfo = document.getElementById("emprendimiento-info");
        emprendimientoInfo.innerHTML = `
            <img src="http://localhost:3000${emprendimiento.imagenEmprendimiento || '/uploads/defaultImage.png'}" alt="${emprendimiento.nombreEmprendimiento}" />
            <h1>${emprendimiento.nombreEmprendimiento}</h1>
        `;

        // Cargar productos
        const productosResponse = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}/productos`);
        const productos = await productosResponse.json();

        const productosLista = document.getElementById("productos-lista");
        productos.forEach(producto => {
            productosLista.innerHTML += `
                <div class="producto">
                    <img src="http://localhost:3000${producto.imagenProducto || '/uploads/defaultImage.png'}" alt="${producto.nombre}" />
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio}</p>
                </div>
            `;
        });

        
    } catch (error) {
        console.error("Error al cargar los detalles del emprendimiento:", error);
    }
});
