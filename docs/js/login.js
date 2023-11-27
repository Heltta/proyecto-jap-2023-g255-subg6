const WEBSITE_URL = 'http://127.0.0.1:3000';
const idUserCart = '25801';
const APIcarritoURL = WEBSITE_URL + '/emercado-api/user_cart/' + idUserCart;
const APIloginURL = WEBSITE_URL + '/emercado-api/login';

// Function del Login:

async function ingresar() {
  // traer carrito y guardarlo en el localStorage
  const resultadoLogin = await postLogin();

  if (resultadoLogin) {
    let user = document.getElementById('user').value;
    localStorage.setItem('user', user);
    let carrito = await getCarritoDeCompras(resultadoLogin.token);
    localStorage.setItem('cart', JSON.stringify(carrito));
    setUserIsLogged(true);

    window.location.href = 'index.html';
  }
}

async function postLogin() {
  let user = document.getElementById('user').value;
  let pass = document.getElementById('pass').value;

  const respuesta = await fetch(APIloginURL, {
    method: 'POST',
    body: JSON.stringify({
      username: user,
      password: pass,
    }),
  });

  if (respuesta.ok) {
    return respuesta.json();
  }

  return;
}

// Obtiene el carrito de compras del usuario desde la API
async function getCarritoDeCompras(webjsonToken) {
  let myHeaders = new Headers();
  myHeaders.append('access-token', webjsonToken);

  return fetch(APIcarritoURL, {
    headers: myHeaders,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then((carrito) => {
      return carrito;
    });
}

// EventListener para detectar el click en login.html y redirigir a index.html

document.addEventListener('DOMContentLoaded', function () {
  if (userIsLogged()) {
    window.location.href = 'index.html';
  }

  /**
   * @type {HTMLFormElement}
   */
  const formularioLogin = document.getElementById('formularioLogin');

  formularioLogin.addEventListener('submit', function (event) {
    if (!formularioLogin.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      ingresar();
    }
    event.preventDefault();

    formularioLogin.classList.add('was-validated');

    if (document.getElementById('formularioLogin').checkValidity()) {
      event.preventDefault();
    }
  });
});

/**
 * Obtener estado de logged del usuario
 *
 * Obtiene del localStorage el valor de la data de key 'userIsLogged' en el localStorage
 */
function userIsLogged() {
  return localStorage.getItem('userIsLogged') === 'true';
}

/**
 * Cambiar estado de logged del usuario
 *
 * Cambia el valor de la data de key 'userIsLogged' en el localStorage
 * a true o false acorde a lo ingresado como parametro.
 */
function setUserIsLogged(isLogged) {
  // Doble negación para evita asignar algo que no sea Bool
  localStorage.setItem('userIsLogged', !!isLogged);
}
