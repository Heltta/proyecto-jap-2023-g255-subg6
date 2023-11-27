const ORDER_ASC_BY_PRICE = 'AscPrice';
const ORDER_DESC_BY_PRICE = 'DescPrice';
const ORDER_BY_PROD_REL = 'Precio';
let minCount = undefined;
let maxCount = undefined;
let searchTerm = undefined; // contenido de la barra de busqueda
const search = document.querySelector('.Search-input');

// Arrays donde se guardan los datos recibidos:
let productsArray = [];

function setProductId(id) {
  localStorage.setItem('productID', id);
  window.location = 'product-info.html';
}

// Acepta un producto como parámetro y retorna si su precio se encuentra dentro del rango filtrado:
function precioDentroDeRango(product) {
  return (
    (minCount == undefined ||
      (minCount != undefined && parseInt(product.cost) >= minCount)) &&
    (maxCount == undefined ||
      (maxCount != undefined && parseInt(product.cost) <= maxCount))
  );
}

// Limpiar filtros, es llamada por el boton limpiar:
function limpiarFiltros() {
  document.getElementById('rangeFilterCountMin').value = '';
  document.getElementById('rangeFilterCountMax').value = '';

  minCount = undefined;
  maxCount = undefined;

  mostrarListaItems(productsArray);
}

// Recibe como parametro un valor de Count y lo parsea a Int:
function parseCountToInt(countValue) {
  if (
    countValue != undefined &&
    countValue != '' &&
    parseInt(countValue) >= 0
  ) {
    return parseInt(countValue);
  } else {
    return undefined;
  }
}

// Aplica los filtros del precio
function aplicarFiltros() {
  minCount = document.getElementById('rangeFilterCountMin').value;
  maxCount = document.getElementById('rangeFilterCountMax').value;

  minCount = parseCountToInt(minCount);
  maxCount = parseCountToInt(maxCount);

  mostrarListaItems(productsArray);
}

function sortAndShowProducts(sortCriteria, productsArrays) {
  if (productsArrays != undefined) {
    productsArray = productsArrays;
  }

  productsArray = sortProducts(sortCriteria, productsArray);

  // Muestra la lista de forma ordenada
  mostrarListaItems(productsArray);
}

function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_REL) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

/**
 * Obtener productos
 *
 * Solicita a la API el listado de productos de la categoría deseada.
 * Retorna una promesa que al cumplirse devuelve un objeto del tipo Category
 */
async function getProducts() {
  const idCategory = localStorage.getItem('catID'); // id de la categoría
  showSpinner();
  try {
    // Pide a la API la lista de productos en la categoría espera a que
    // se resuelva la promesa y guarda la respuesta "cruda" en una constante
    const respuestaAPI = await fetch(PRODUCTS_URL + idCategory);
    hideSpinner();
    // Parsea la respuesta y la retorna
    // Nota: En realidad retorna una promesa (usar await o .then())
    return respuestaAPI.json();
  } catch (error) {
    hideSpinner();
    alert(error);
    return undefined;
  }
}

/** Generar elemento de item
 *
 * Recibe un objeto de tipo Product (como un Auto).
 * Retorna un elemento del DOM con las caracteristicas de un auto.
 * Ejemplo: que retorne un elem tal que elem.innerHTML == <div>Marca: Wolkswagen Modelo: Gol<div>.
 */
function generarElementoDeProduct(product) {
  let htmlContentToAppend =
    `
  <div onclick="setProductId(${product.id})" class="list-group-item list-group-item-action cursor-active">
      <div class="row">
          <div class="col-3">
              <img src="` +
    product.image +
    `" alt="product image" class="img-thumbnail">
          </div>
          <div class="col">
              <div class="d-flex w-100 justify-content-between">
                  <div class="mb-1">
                  <h4>` +
    product.name +
    ` - USD ` +
    product.cost +
    `</h4> 
                  <p> ` +
    product.description +
    `</p> 
                  </div>
                  <small class="text-muted">` +
    product.soldCount +
    ` Vendidos</small> 
              </div>

          </div>
      </div>
  </div>
  `; /*aca va el contenido html que se generara para mostrar el producto*/

  let productDOM = document.createElement('div'); //aca se crea el elemento del dom que incluira el contenido html
  productDOM.id = product.id; // se agrega el id al div
  productDOM.innerHTML = htmlContentToAppend; //aca se actualiza el contenido del elemento con el contenido de htmlContentToAppends
  return productDOM;
}

/**
 * Determina si un producto coincide con el criterio de busqueda de la search bar
 *
 * @param {*} producto un producto con titulo y descripcion.
 * @global searchTerm: el contenido de la barra de busqueda.
 * @returns {boolean} true si coincide con el criterio de busqueda, false en caso contrario.
 */
function coincideConBusqueda(producto) {
  if (searchTerm === '' || searchTerm === undefined || searchTerm === null)
    return true;
  const titulo = producto.name.toLowerCase();
  const descripcion = producto.description.toLowerCase();
  return titulo.includes(searchTerm) || descripcion.includes(searchTerm);
}

/**
 * Recibe un producto como parametro y revisa si cumple todos los filtros,
 * retorna true en caso de satisfacerlos todos los criterios
 */
function productoCumpleFiltro(product) {
  // Por ahora solo tenemos una condicion
  return precioDentroDeRango(product) && coincideConBusqueda(product);
}

/**
 * Genera un elemento del DOM con una lista de elementos con datos
 * de los Productos a partir de un arreglo de Productos
 *
 * Lista en pantalla una lista de items.
 * Tiene en cuenta los filtros aplicados.
 */
function generarElementoListaItems(listaDeItems) {
  const listaProductos = document.createElement('ol');
  for (let i = 0; i < listaDeItems.length; i++)
    if (productoCumpleFiltro(listaDeItems[i]))
      listaProductos.appendChild(generarElementoDeProduct(listaDeItems[i]));
  listaProductos.style = 'list-style: none; padding-left: 0';
  return listaProductos;
}

/**
 * Eliminar alerta de "En desarrollo"
 *
 * Busca y elimina la alerta en rojo de "Funcionalidad en desarrollo".
 */
function eliminarEnDesarrollo() {
  let alerta = document.getElementsByClassName(
    'alert alert-danger text-center'
  );
  alerta[0].remove();
}

function mostrarListaItems(listaDeItems) {
  const listaDeProductos = generarElementoListaItems(listaDeItems);
  const contenedorDeLista = document.getElementById('contenedor-productos');
  contenedorDeLista.innerHTML = '';
  contenedorDeLista.appendChild(listaDeProductos);
}

/**
 * Muestra, dentro de un elemento contenedor del HTML, todos
 * los objetos Product de la Category cars (id 101)
 *
 */
async function printAllProducts() {
  try {
    const categoriaProductos = await getProducts();
    productsArray = categoriaProductos.products;
    mostrarListaItems(categoriaProductos.products);
  } catch (error) {
    alert(error);
  }
}

// Llamados a las funciones luego de que el DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
  eliminarEnDesarrollo();

  // Filtro
  document.getElementById('sortAsc').addEventListener('click', function () {
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });

  document.getElementById('sortDesc').addEventListener('click', function () {
    sortAndShowProducts(ORDER_DESC_BY_PRICE);
  });

  document.getElementById('sortByCount').addEventListener('click', function () {
    sortAndShowProducts(ORDER_BY_PROD_REL);
  });

  // Botón limpiar
  document
    .getElementById('clearRangeFilter')
    .addEventListener('click', limpiarFiltros);

  // Filtrar productos por mínimo y máximo de precios
  document
    .getElementById('rangeFilterCount')
    .addEventListener('click', aplicarFiltros);

  printAllProducts();
});

// Buscar productos
// Obtener el elemento de entrada de búsqueda
const searchInput = document.getElementById('searchInput');
// Agregar un evento de entrada al campo de búsqueda
searchInput.addEventListener('input', function (e) {
  searchTerm = e.target.value.toLowerCase(); // Actualiza el valor del searchTerm
  mostrarListaItems(productsArray);
});
