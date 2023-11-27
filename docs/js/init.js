const WEBSITE_URL = 'http://127.0.0.1:3000';

const CATEGORIES_URL = WEBSITE_URL + '/emercado-api/cats/cat.json';
const PUBLISH_PRODUCT_URL = WEBSITE_URL + '/emercado-api/sell/publish.json';
const PRODUCTS_URL = WEBSITE_URL + '/emercado-api/cats_products/';
const PRODUCT_INFO_URL = WEBSITE_URL + '/emercado-api/cats/products/';
const PRODUCT_INFO_COMMENTS_URL =
  WEBSITE_URL + '/emercado-api/cats/products_comments/';
const CART_INFO_URL = WEBSITE_URL + '/emercado-api/user_cart/';
const CART_BUY_URL = WEBSITE_URL + '/emercado-api/cart/buy.json';

const EXT_TYPE = '.json';

let showSpinner = function () {
  document.getElementById('spinner-wrapper').style.display = 'block';
};

let hideSpinner = function () {
  document.getElementById('spinner-wrapper').style.display = 'none';
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};
/**
 * Obtener estado de logged del usuario
 *
 * Obtiene del localStorage el valor de la data de key 'userIsLogged' en el localStorage
 */
function userIsLogged() {
  return localStorage.getItem('userIsLogged') === 'true';
}

function setUserIsLogged(isLogged) {
  // Doble negación para evita asignar algo que no sea Bool
  localStorage.setItem('userIsLogged', !!isLogged);
}

/**
 * @typedef {object} ColorMode
 *
 * @property {String} value Valor del local storage que representa este modo
 * @property {String} className Clases (html) del icono del modo
 * @property {String} ariaLabel Texto alternativo para el modo (para personas sin vision)
 * @property {Function} applicarColor funcion que aplica el estilo a la pagina
 */

const colorModeIdentifier = 'colorMode';
const darkMode = {
  value: 'dark',
  className: 'bi bi-moon-stars-fill',
  ariaLabel: 'dark color mode',
  applicarColor: () => {
    const bgColor = '#0d1113';
    const fontColor = '#ffffff';
    aplicarColores(bgColor, fontColor);
  },
};
const lightMode = {
  value: 'light',
  className: 'bi bi-sun-fill',
  ariaLabel: 'light color mode',
  applicarColor: () => {
    const bgColor = '#ffffff';
    const fontColor = '#0d1113';
    aplicarColores(bgColor, fontColor);
  },
};

function aplicarColores(backgrounColor, fontColor) {
  /**
   * @type {Array<Element>}
   */
  const elementos = [];
  elementos.push(document.getElementsByTagName('body')[0]);
  elementos.push(...document.getElementsByClassName('list-group-item'));
  // elementos.forEach(elem =>{
  //   if (!elem.style) return
  //   elem.style.color = fontColor;
  //   elem.style.backgroundColor = backgrounColor;
  // })
}

/**
 * Obtiene el valor del modo de color actual desde el localStorage, invierte su valor en el localStorage
 * y cambia el icono del boton al correspondiente.
 *
 * @param {Element} iconElement
 */
function swapColorMode(iconElement) {
  const currentColorMode = localStorage.getItem(colorModeIdentifier);

  if (!currentColorMode || currentColorMode === darkMode.value) {
    setColorMode(lightMode, iconElement);
  } else if (currentColorMode === lightMode.value) {
    setColorMode(darkMode, iconElement);
  } else {
    // caso el local storage no coincide con uno de los posibles valores
    setColorMode(darkMode, iconElement);
  }
}

/**
 * Settea el valor de la variable del local storage y cambia el icono
 *
 * @param {ColorMode} colorMode
 * @param {Element} iconElement
 */
function setColorMode(colorMode, iconElement) {
  localStorage.setItem(colorModeIdentifier, colorMode.value);
  document.documentElement.setAttribute('data-theme', colorMode.value); // Aqui aqui aqui!!!! lo del data theme
  iconElement.className = colorMode.className;
  iconElement.ariaLabel = colorMode.ariaLabel;
  colorMode.applicarColor();
}

function createColorModeButtons() {
  const container = document.createElement('li');
  container.className = 'nav-item';
  container.ariaLabel = 'set color mode';

  const colorModeIcon = document.createElement('i');
  const currentColorMode = localStorage.getItem(colorModeIdentifier);
  if (!currentColorMode || currentColorMode === lightMode.value) {
    setColorMode(lightMode, colorModeIcon);
  } else if (currentColorMode === darkMode.value) {
    setColorMode(darkMode, colorModeIcon);
  }

  const colorModeButton = document.createElement('button');
  colorModeButton.appendChild(colorModeIcon);
  colorModeButton.className = 'btn btn-link';
  colorModeButton.addEventListener('click', () => swapColorMode(colorModeIcon));
  colorModeButton.addEventListener(
    'change',
    () => swapColorMode(colorModeIcon),
    false
  );

  container.appendChild(colorModeButton);

  return container;
}

function insertColorModeButtons() {
  const barraNavegacion = document.querySelector('#navbarNav>ul:first-child');
  barraNavegacion.appendChild(createColorModeButtons());
}

//Genera un menu desplegable en el boton de nombre de usuario
function generarMenuDesplegable() {
  const username = localStorage.getItem('user');
  let htmlContentToAppend =
    `
    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    ` +
    username[0].toUpperCase() +
    username.slice(1).toLowerCase() +
    `
    </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
    <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
    <li><a class="dropdown-item" id="cierreDeSesion" >Cerrar sesión</a></li>
  </ul>
  `;

  let barraNavegacion = document.querySelector('#navbarNav>ul:first-child');
  let menuDesplegable = document.createElement('li');
  menuDesplegable.className = 'nav-item dropdown';
  menuDesplegable.innerHTML = htmlContentToAppend;
  barraNavegacion.appendChild(menuDesplegable);

  botonCerrarSesion = document.getElementById('cierreDeSesion');
  botonCerrarSesion.addEventListener('click', () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'ATENCIÓN: ¿Desea cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        setUserIsLogged(false);
        window.location.href = 'login.html';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (!userIsLogged()) {
    window.location.href = 'login.html';
  }
  insertColorModeButtons();
  // Verifica si el usuario ya está logueado
  if (userIsLogged()) {
    // Si está logueado muestra button, con el nombre guardado en el almacenamiento local y un dropdown
    generarMenuDesplegable();
  }
});
