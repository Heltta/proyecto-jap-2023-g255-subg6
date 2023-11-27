
const commentFormId = 'comentar'; // id del form para ingresar comentarios
const commentsContainerId = 'comentarios-container'; // id del contenedor de comentarios
const registerCommentForm = document.getElementById("comentar");
const scoreInput = document.getElementById("inputScore");
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');
let cart =  JSON.parse(localStorage.getItem("cart"));
let articulosCarrito = [];
let carritofinal = JSON.parse(localStorage.getItem("productCartID"));

let currentIndex = 0;
let images = [];

// Función para cargar las imágenes desde la API
async function fetchImages() {
    try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de imágenes desde la API.');
        }
        const data = await response.json();
        images = data.images; 
        showSlide(currentIndex);
    } catch (error) {
        console.error(error);
    }
}


function showSlide(index) {
    if (images.length === 0) {
        console.error('No se han cargado imágenes desde la API.');
        return;
    }

    if (index < 0) {
        currentIndex = images.length - 1;
    } else if (index >= images.length) {
        currentIndex = 0;
    }

    const imageUrl = images[currentIndex];
    carouselContainer.style.backgroundImage = `url(${imageUrl})`;
}

prevButton.addEventListener('click', () => {
    currentIndex--;
    showSlide(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex++;
    showSlide(currentIndex);
});

// Cargar imágenes desde la API al cargar la página
fetchImages();

/**
 * @typedef {object} comment
 *
 * @property {Number} product id del producto
 * @property {Number} score calificacion del producto
 * @property {String} description descripcion del producto
 * @property {String} user username del autor del comentario
 * @property {String} dateTime fecha de creacion del comentario
 */

/**
 * Generar elemento de estrellas de calificacion
 *
 * @param {Number} calificacion
 * @param {Number} maxCalificacion opcional, 5 es el valor por default
 * @returns
 */
function crearElementoCalificacion(calificacion, maxCalificacion = 5) {
  const estrellaLlena = '★';
  const estrellaVacia = '☆';
  const domCalificacion = document.createElement('div');

  let estrella;
  for (let nEstrella = 1; nEstrella < maxCalificacion; nEstrella++) {
    estrella = document.createElement('span');
    if (calificacion > nEstrella) estrella.innerHTML = estrellaLlena;
    else estrella.innerHTML = estrellaVacia;
    domCalificacion.appendChild = estrella;
  }

  return domCalificacion;
}

//
// let userRating = 0;
function setRating(rating) {
    scoreInput.value = rating;
    updateStars();
}

function updateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < scoreInput.value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

/**
 * 
 * @param {Element} radioEstrella
 */
function addSetRatingToRadio(radioEstrella, scoreValue){
    radioEstrella.addEventListener("click", (e) => {
        setRating(scoreValue)
        console.log(scoreValue)
    })
}


/**
 * Obtener datos del nuevo comentario
 *
 * Obtiene los datos de un nuevo comentario a partir de los inputs del registro de comentario.
 *
 * @returns {comment}
 */
function getDatosNuevoComentario() {
  const datosComentario = {};
  datosComentario.product = localStorage.getItem('productID');
  datosComentario.score = document.getElementById('inputScore').value;
  datosComentario.description =
    document.getElementById('inputDescription').value;
  datosComentario.user = localStorage.getItem("user")
  const fechaActual = new Date();
  datosComentario.dateTime = fechaActual.toLocaleDateString() + " " + fechaActual.toLocaleTimeString();
  return datosComentario;
}

/**
 * Mostrar nuevo comentario
 *
 * Inserta en la vista el elemento del dom del nuevo comentario a partir de los datos del registro del mismo
 */
function mostrarNuevoComentario() {
  const dataComentario = getDatosNuevoComentario();
  const domComentario = crearElementoComentario(dataComentario);
  const contenedorComentarios = document.getElementById(commentsContainerId);
  contenedorComentarios.appendChild(domComentario);
}

/**
 * Registro de comentario
 *
 * Event listener para el registro de un nuevo comentario
 *
 * @param {Event} evento
 */
function registroDeComentario(evento) {
  evento.preventDefault();
  mostrarNuevoComentario();
}

let productID = localStorage.getItem("productID");  // Guarda el id del producto del almacenamiento local
let productInfo = {}; 

async function getProductInfo () {
    
    try {
        const productInfo = await fetch ( PRODUCT_INFO_URL + productID); // Solicita al servidor para obtener la información del producto
        const product = await productInfo.json(); // Convierte la respuesta a JSON
        return product
        
       
    } catch (error) {
        alert(error)
    }
}
// Función para obtener comentarios
function getAndShowComentarios(id) {
    let comentariosEndpoint = PRODUCT_INFO_COMMENTS_URL + id; 
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
        comentariosContainer.appendChild(crearElementoComentario(comentario));
        
    });
}

/**
 * Generar elemento de comentario
 *
 * Recibe un objeto de tipo comment, usa sus datos para crear un elemento del DOM de un comentario.
 * No valida que la estructura y contenido del comentario sean adecuadas.
 * @param {comment} comment comentario de un usuario sobre un producto
 * @returns {Element} elemento del dom de un comentario
 */
function crearElementoComentario (comentario){
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


// Función para mostrar productos, su respectiva información y productos
function showProductsInfo() {
    let htmlContentToAppend = "";
    let productrelated = "";


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
                <div class="col-md-4 offset-md-4">
                <button type="button" class="btn btn-success" onclick="setProductCart()">Comprar</button>
                </div>
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
// Mostrar productos relacionados 
        productrelated += `
        <div class="">
            <div class="row">
                <div class=" w-100 justify-content-between">
                    <div class="mb-1">
                        <h3 class="ms-3">Productos relacionados</h3>
                        <br>
                        <div class="row">
                         ${productInfo.relatedProducts.map((ima) => {
                          return `<div onclick="setProductId(${ima.id})" class="col card cursor-active" style="padding:0px; margin:20px; max-width:50%;"> 
                          <img class="card-img-top" src="${ima.image}" alt="product image" class="img-thumbnail">
                          <div class="card-body">
                          <p class="card-text">${ima.name}</p> 
                          </div>
                          </div>`
                         }).join(" ")}  
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

    document.getElementById("product-info-container").innerHTML = htmlContentToAppend;     
    document.getElementById("productRelated").innerHTML = productrelated; 
}

function setProductId(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
} 

// Función para guardar los productos en el carrito
function setProductCart(){
    if ((carritofinal < 1 || carritofinal == null) && !cart.articles.some((product)=> product.id== productInfo.id)){
        // obtener todo el objeto producto
        // insertar el objeto producto en el carrito
        cart.articles.push({count:1,image:productInfo.images[0],unitCost:productInfo.cost,...productInfo});
        localStorage.setItem('cart', JSON.stringify(cart));
    } else if(cart.articles.some((product)=> product.id== productInfo.id)){
        cart.articles.forEach((product)=> {
            if(product.id== productInfo.id) product.count++
            localStorage.setItem('cart', JSON.stringify(cart));
        })
    } else {
        carritofinal.push(productInfo.id);
        localStorage.setItem("productCartID", JSON.stringify(carritofinal));
    }
    window.location = "cart.html"
}


document.addEventListener("DOMContentLoaded", function(e){
    eliminarEnDesarrollo();
    getJSONData(PRODUCT_INFO_URL + productID).then(function(resultObj){
        if (resultObj.status === "ok") 
        {
            productInfo = resultObj.data;
            showProductsInfo();
            getAndShowComentarios(productID);
        }
    })
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        addSetRatingToRadio(star,index+1);
    });
    registerCommentForm.addEventListener("submit",registroDeComentario)

});
