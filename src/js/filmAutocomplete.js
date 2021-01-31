/* eslint-disable array-callback-return */
/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-template */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-extra-semi */
/* eslint-disable prefer-arrow-callback */
// import $ from 'jquery';
// import { formatReleaseDate } from './formatRelease';

// import 'jquery-ui/ui/widgets/autocomplete';

document.addEventListener('DOMContentLoaded', function () {
  let typingTimer;
  let resultFunc;
  let currentFocus;
  const apiKey = '35c2658e0e706d145f4d4f7e995e368f';
  const val = document.getElementById('filmsListInput');
  const parentDiv = document.getElementById('parentDiv');

  function closeAllLists(elmnt) {
    const x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== val) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  function autocomplete() {
    const radioList = document.getElementById('radioList');
    const radioPosters = document.getElementById('radioPosters');
    closeAllLists();
    if (!val.value) {
      return false;
    }
    currentFocus = -1;
    parentDiv.style.display = 'block';
    const filmList = document.createElement('DIV');
    filmList.setAttribute('id', 'autocomplete-list');
    filmList.setAttribute('class', 'autocomplete-items');
    parentDiv.appendChild(filmList);
    if (resultFunc.length > 0) {
      if (radioList.checked) {
        resultFunc.map(function (film) {
          const listItem = document.createElement('DIV');
          listItem.innerHTML = film.title + ' (' + film.vote_average.toFixed(1) + ')';
          listItem.innerHTML += "<input type='hidden' value='" + film.title + ' (' + film.vote_average.toFixed(1) + ')' + "'>";
          listItem.addEventListener('click', function () {
            val.value = this.getElementsByTagName('input')[0].value;
            closeAllLists();
          });
          filmList.appendChild(listItem);
        });
      } else if (radioPosters.checked) {
        filmList.classList.add('autocomplete-posters');
        for (let i = 0; i < 3; i++) {
          const imageDiv = document.createElement('DIV');
          const image = document.createElement('IMG');
          if (resultFunc[i].poster_path) {
            image.setAttribute('src', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + resultFunc[i].poster_path);
          } else {
            image.setAttribute('src', 'https://media.istockphoto.com/vectors/internet-error-page-not-found-in-vertical-orientation-for-mobile-a-vector-id1252582562?s=612x612');
          }

          image.setAttribute('class', 'poster-style');
          filmList.appendChild(imageDiv);
          imageDiv.appendChild(image);

          const filmTitle = document.createElement('H4');
          filmTitle.innerHTML = resultFunc[i].title;
          imageDiv.appendChild(filmTitle);

          const filmYear = document.createElement('P');
          if (resultFunc[i].release_date) {
            filmYear.innerHTML = resultFunc[i].release_date.slice(0, 4);
          } else {
            filmYear.innerHTML = 'unknown';
          }
          imageDiv.appendChild(filmYear);
        }
      }
    } else {
      filmList.innerHTML = 'No results';
    }
  };

  function ajax() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + val.value, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        resultFunc = JSON.parse(xhr.responseText).results;
        autocomplete();
      } else {
        console.log('Unable to load data');
      }
    };

    xhr.send();
  }

  function reqDelay() {
    clearTimeout(typingTimer);
    if (val.value) {
      typingTimer = setTimeout(ajax, 500);
    }
  }

  val.addEventListener('input', reqDelay);

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add('autocomplete-active');
  }

  val.addEventListener('keydown', function (e) {
    let x = document.getElementById('autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode === 40) { //down
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) { //enter
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
    parentDiv.style.display = 'none';
  });
});
