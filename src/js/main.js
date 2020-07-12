'use strict';

console.log('Todo va bien');

//ARRAYS
let series = [];
let favorites = [];

//CONSTANTS
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const seriesBoxList = document.querySelector('.js-series-list');
const favBoxList = document.querySelector('.js-fav-list');
const resetButton = document.querySelector('.js-reset-button');
const resetFavButton = document.querySelector('.js-reset-fav-button');
const form = document.querySelector('.js-search-form');

//FUNCTIONS

//FECTH AL HACER CLICK
function handlerClickButton() {
  getFromLocalStorage();
  console.log('Me han clickado');
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Me llega info');
      series = data;
      paintSeries();
    });
}

//DESPUÉS DEL FETCH QUE ME PINTE LOS DATOS DE LA BUSQUEDA
function paintSeries() {
  //AQUI TENDRIA QUE TENER EN CUENTA LAS QUE ESTÁN EN EL ARRAY DE FAVORITOS
  let htmlCode = '';
  for (let i = 0; i < series.length; i++) {
    htmlCode += `<li class="box-results js-box-results" id="${series[i].show.id}">`;
    if (series[i].show.image === null) {
      htmlCode += `<div><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" class="image-result js-image-result"></div>`;
    } else {
      htmlCode += `<div class="box-image"><img src=${series[i].show.image.medium} class="image-result js-image-result"></div>`;
    }
    htmlCode += `<h3 class="title-result js-title-result">${series[i].show.name}</h3>`;
    htmlCode += `</li>`;
  }
  seriesBoxList.innerHTML = htmlCode;
  liListeners();
}

//REGISTRA EL CLICK PARA AÑADIR A FAVORITOS Y CAMBIA EL ESTILO Y EL ARRAY
function addToFavList(ev) {
  const id = ev.currentTarget.id;
  const serie = findSerie(id, series);
  if (findSerie(id, favorites)) {
    ev.currentTarget.classList.remove('change-color');
    favorites.splice(favorites.indexOf(id), 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Ya estaba en favoritos', id);
  } else {
    ev.currentTarget.classList.add('change-color');
    saveFavorite(serie);
    console.log(
      'No estaba en favoritos, le pongo el estilo y le hago push y la meto en el local'
    );
  }
}

//ENCUENTRA LA SERIE A TRAVES DEL IS
function findSerie(id, series) {
  //EL ID QUE DEVUELVE ES UN STRING, POR ESO LO PARSEAMOS
  id = parseInt(id);
  return series.find((serie) => serie.show.id === id);
}

//AÑADIMOS A ARRAY Y LOCAL STORAGE
function saveFavorite(serie) {
  favorites.push(serie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log(favorites);
}
//PARA PINTAR FAVORITOS
function paintFavorites() {
  console.log('He entrado en la función de pintar');
  let htmlCode = '';
  for (let i = 0; i < favorites.length; i++) {
    htmlCode += `<li class="box-results js-box-results" id="${favorites[i].show.id}">`;
    htmlCode += `<button type="button" class="clear-btn js-clear-btn">X</button>`;
    if (favorites[i].show.image === null) {
      htmlCode += `<div><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" class="image-result js-image-result"></div>`;
    } else {
      htmlCode += `<div class="box-image"><img src=${favorites[i].show.image.medium} class="image-result js-image-result"></div>`;
    }
    htmlCode += `<h3 class="title-result js-title-result">${favorites[i].show.name}</h3>`;
    htmlCode += `</li>`;
  }
  favBoxList.innerHTML = htmlCode;
}
//PARA ELIMINAR CADA FAVORITO UNO POR UNO CON EL BÓTON
function removeFromList(ev) {
  const id = ev.currentTarget.parentElement.id;
  const serie = findSerie(id, favorites);
  favorites.splice(favorites.indexOf(serie), 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  favBoxList.removeChild(ev.currentTarget.parentElement);
}

//BORRAR LA BÚSQUEDA
function resetForm() {
  form.reset();
  seriesBoxList.innerHTML = '';
}

//BORRAR FAVORITOS Y ACTUALIZAR LOCAL STORAGE
function resetFav() {
  favBoxList.innerHTML = '';
  favorites = [];
  localStorage.removeItem('favorites');
  getFromLocalStorage();
}

//GET FROM STORAGE
function getFromLocalStorage() {
  console.log('Estoy tomando lo que hay en el local');
  if (JSON.parse(localStorage.getItem('favorites'))) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    console.log('Parece que sí hay cosas en local');
    for (const serie of favorites) {
      paintFavorites(series);
    }
  } else {
    favBoxList.innerHTML = '';
    localStorage.removeItem('favorites');
    console.log('no hay nada en local storage');
  }
}
getFromLocalStorage();

//LISTENERS
searchBtn.addEventListener('click', handlerClickButton);
resetButton.addEventListener('click', resetForm);
resetFavButton.addEventListener('click', resetFav);

function liListeners() {
  const fav = document.querySelectorAll('.js-box-results');
  console.log(fav);
  for (const elem of fav) {
    elem.addEventListener('click', addToFavList);
    elem.addEventListener('click', paintFavorites);
  }
}
removeFromFavList();

function removeFromFavList() {
  const resetFavSerie = document.querySelectorAll('.js-clear-btn');
  for (const elem of resetFavSerie) {
    elem.addEventListener('click', removeFromList);
  }
}
