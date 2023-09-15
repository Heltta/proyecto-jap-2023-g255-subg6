// Función para obtener comentarios
function getComentarios(producto) {
    let id = producto.id;
    let comentariosEndpoint = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
    fetch(comentariosEndpoint)
        .then((response) => response.json())
        .then((comentarios) => {
            mostrarComentarios(comentarios);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Función para mostrar comentarios
function mostrarComentarios(comentarios) {
    const comentariosContainer = document.getElementById("comentarios-container");
    comentariosContainer.innerHTML = "";
    comentarios.forEach((comentario) => {
        const comentarioElement = document.createElement("div");
        comentarioElement.innerHTML = `
            <p>Usuario: ${comentario.user}</p>
            <p>Puntuación: ${comentario.score}</p>
            <p>Descripción: ${comentario.description}</p>
            <p>Fecha y hora: ${comentario.dateTime}</p>
            <hr>
        `;
        comentariosContainer.appendChild(comentarioElement);
    });
}

//Función encargada de Mostrar en pantalla la calificación generada en Comentarios.
document.addEventListener("DOMContentLoaded", function () {

    let dropdownItems = document.querySelectorAll(".dropdown-item");
    
    let selectedRating = document.getElementById("selectedRating");

    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            let rating = event.target.getAttribute("data-value");
            selectedRating.innerHTML = "Calificación seleccionada: " + "⭐".repeat(rating);
        });
    });
});
