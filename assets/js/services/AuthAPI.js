import axios from "axios";
import CustomersAPI from "../services/CustomersAPI";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 * Deconnexion et Suppression du TOKEN du LocalStorage et sur Axios
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête http d'authentification et Stokage du token dans le localStorage et sur Axios
 *
 * @param {Object} credentials
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stokage du token dans le localStorage
      window.localStorage.setItem("authToken", token);
      // On prévient axios que l'on a maintenant un Header par défaut pour nos futur requêtes HTTP
      setAxiosToken(token);
    });
}

/**
 * Posistion le JWT Token sur Axios
 * @param {string} token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place du Token lors du chargement de l'application
 */
function setup() {
  // On vérifie si on a un Token
  const token = window.localStorage.getItem("authToken");
  if (token) {
    // On Vérifie s'il est valable
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // Voir si on a un Token
  const token = window.localStorage.getItem("authToken");
  if (token) {
    // On vérifie s'il est Valable ou pas
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
