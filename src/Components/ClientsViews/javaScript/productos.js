document.addEventListener("DOMContentLoaded", async () => {
    const emprendimientoId = new URLSearchParams(window.location.search).get("id");

    if (!emprendimientoId) {
        alert("No se encontró el ID del emprendimiento.");
        return;
    }

    try {
        // Cargar información del emprendimiento
        const emprendimientoResponse = await fetch(`http://192.168.77.39:3000/emprendimientos/${emprendimientoId}`);
        if (!emprendimientoResponse.ok) throw new Error("Error al cargar el emprendimiento.");

        const emprendimiento = await emprendimientoResponse.json();
        const emprendimientoInfo = document.getElementById("emprendimiento-info");
        emprendimientoInfo.innerHTML = `
            <h1>${emprendimiento.nombreEmprendimiento}</h1>
            <p>${emprendimiento.descripcion || "Sin descripción"}</p>
        `;

        // Cargar productos
        const token = localStorage.getItem("authToken");

        const productosResponse = await fetch(`http://192.168.77.39:3000/productos?id=${emprendimientoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!productosResponse.ok) throw new Error("Error al cargar los productos.");


        const productos = await productosResponse.json();

        console.log("ID del emprendimiento recibido:", emprendimientoId);


        const productosLista = document.getElementById("productos-lista");
        productosLista.innerHTML = ""; // Limpia la lista antes de añadir productos

        // Validar si productos es un array
        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach(producto => {
                productosLista.innerHTML += `
                    <div class="producto">
                        <img src="http://192.168.77.39:3000${producto.imagenProducto || '/uploads/defaultImage.png'}" 
                             alt="${producto.nombre}" class="producto-img"/>
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                    </div>
                `;
            });

        } else {
            productosLista.innerHTML = "<p>No hay productos disponibles.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        productosLista.innerHTML = "<p>Error al cargar los productos.</p>";
    }
});


