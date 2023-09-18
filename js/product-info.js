let productID = localStorage.getItem("productID");  // Guarda el id del producto del almacenamiento local
let productsInfoArray = []; 

async function getProductInfo () {
    
    try {
        const productInfo = await fetch (`https://japceibal.github.io/emercado-api/products/${productID}.json`); // Solicita al servidor para obtener la información del producto
        const product = await productInfo.json(); // Convierte la respuesta a JSON
        return product
        
       
    } catch (error) {
        alert(error)
    }
}
// Función para obtener comentarios
function getAndShowComentarios(id) {
    let comentariosEndpoint = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
    fetch(comentariosEndpoint)
        .then((response) => response.json())
        .then((comentarios) => {
            mostrarComentarios(comentarios);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}

// Función para mostrar comentarios
function mostrarComentarios(comentarios) {
    const comentariosContainer = document.getElementById("comentarios-container");
    comentariosContainer.innerHTML = "";
    comentarios.forEach((comentario) => {
        comentariosContainer.appendChild(generarComentario(comentario));
        
    });
}

function generarComentario (comentario){
    let htmlContentToAppend = `
    <p>Usuario: ${comentario.user}</p>
    <p>Puntuación: ${comentario.score}</p>
    <p>Descripción: ${comentario.description}</p>
    <p>Fecha y hora: ${comentario.dateTime}</p>
    `
    let comentarioElement = document.createElement("div");
    comentarioElement.innerHTML = htmlContentToAppend;
    comentarioElement.classList.add("info");
    return comentarioElement;
}


function eliminarEnDesarrollo() {
    let alerta = document.getElementsByClassName(
      'alert alert-danger text-center'
    );
    alerta[0].remove();
  }


// Función para mostrar productos y su respectiva información
function showProductsInfo() {
    let htmlContentToAppend = "";

        let productInfo = productsInfoArray; 

        htmlContentToAppend += `
        <div class="">
            <div class="row">
                <div class="">
                <div class=" w-100 justify-content-between">
                <div class="mb-1">
                <br>
                <div class="row">
                <div class="col-md-4">
                <h1>`+ productInfo.name +`</h1>
                </div>
                <hr>
                <h3>Precio</h3>
                <p>`+ productInfo.cost + `</p>
                <h3>Descripción</h3>
                <p>`+ productInfo.description + `</p>
                <h3>Categoría</h3>
                <p>`+ productInfo.category + `</p>
                <h3>Cantidad de vendidos</h3>
                <p>`+ productInfo.soldCount + `</p>
                <h3>Imágenes ilustrativas</h3>
                <div id="arrowCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div class="carousel-inner">
                    ${productInfo.images.map((ima) => {
                        if (ima === productInfo.images[0]){
                            return `<div class="carousel-item active" data-bs-interval="2000"><img src="${ima}" alt="product image" class="img-thumbnail"></div>`
                        } else {
                            return `<div class="carousel-item" data-bs-interval="2000"><img src="${ima}" alt="product image" class="img-thumbnail"></div>`
                        }
                    }).join(" ")}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#arrowCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#arrowCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
</div>
`              
    document.getElementById("product-info-container").innerHTML = htmlContentToAppend;     
}

function setProductId(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
} 


document.addEventListener("DOMContentLoaded", function(e){
    eliminarEnDesarrollo();
    getJSONData(PRODUCT_INFO_URL + productID + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok") 
        {
            productsInfoArray = resultObj.data;
            showProductsInfo();
            getAndShowComentarios(productID);
        }
    })
});
