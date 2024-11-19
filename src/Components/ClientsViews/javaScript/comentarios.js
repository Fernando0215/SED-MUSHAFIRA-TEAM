// Lista de palabras ofensivas
const malasPalabras = [
    "puta", "hijos de puta", "maldito", "estúpido", "tonto", "idiota", "imbécil", "grosero", "malnacido", "infeliz",
    "pendejo", "cabrón", "chinga", "güey", "mamada", "pinche", "culero", "chingada", "boludo", "pelotudo", "forro", 
    "gil", "puto", "conchudo", "chupamedias", "garca", "gilipollas", "joder", "coño", "hijo de puta", "mamón", 
    "pringado", "gonorrea", "carechimba", "huevón", "malparido", "chimba", "ñero", "weón", "culiao", 
    "conchetumadre", "maraco", "puta madre", "mamabicho", "jodón", "bicho", "cabrón", "pendejo", "coño", "gafo", 
    "pajuo", "mamaguevo", "cerote", "chucho", "mulas", "hueco", "culero", "pijudo", "puñal", "cachimbon", "vergón", 
    "culiado", "burro", "chavacán", "perra", "pendejete", "boludo", "culicagado", "malacate", "maceta", "carnicero", 
    "culicorto", "pizarrín", "lengua floja", "pistoludo", "cara de cuete", "metido", "maldito", "mierda", "weon", "pendeja", "culera"
];

// Función para censurar malas palabras
function censurarTexto(texto) {
    let censurado = texto;
    malasPalabras.forEach(palabra => {
        const regex = new RegExp(`\\b${palabra}\\b`, "gi"); // Crear expresión regular para buscar la palabra
        const reemplazo = "*".repeat(palabra.length); // Crear cadena de asteriscos del mismo tamaño
        censurado = censurado.replace(regex, reemplazo);
    });
    return censurado;
}

// Comentarios de prueba
const comentarios = [
    "Me encanta este emprendimiento, tienen muy buenos productos.",
    "Estos hijos de puta no hacen bien su trabajo.",
    "¡Servicio rápido y de calidad! Muy recomendados.",
    "Los precios son bastante justos. Volveré a comprar aquí.",
    "Maldito servicio, no lo recomiendo para nada.",
    "Pinche servicio, qué chingadera.",
    "Eres un pendejo, no tienes idea."
];

// Referencias a elementos HTML
const commentsContainer = document.getElementById("comments-container");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");

// Función para mostrar comentarios dinámicamente
function displayComments(comments) {
    commentsContainer.innerHTML = ""; // Limpiar contenedor
    comments.forEach(comment => {
        const censoredComment = censurarTexto(comment); // Censurar el comentario
        const commentCard = document.createElement("div");
        commentCard.className = "comment-card";
        commentCard.textContent = censoredComment;
        commentsContainer.appendChild(commentCard);
    });
}

// Evento para enviar un nuevo comentario
commentForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevenir recarga de la página
    const newComment = commentInput.value.trim();
    if (newComment) {
        comentarios.push(newComment); // Agregar comentario al array
        displayComments(comentarios); // Actualizar la vista
        commentInput.value = ""; // Limpiar campo de texto
    }
});

// Inicializar con comentarios de prueba
displayComments(comentarios);
