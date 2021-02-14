/* eslint-disable no-undef */
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

let typingTimer;
let resultFunc;
let currentFocus;
const API_ENDPOINT = 'https://api.themoviedb.org/3/search/movie?api_key=';
const API_KEY = '35c2658e0e706d145f4d4f7e995e368f';
const IMAGE_PATH = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2';
const NOT_FOUND_IMAGE_PATH = 'https://media.istockphoto.com/vectors/internet-error-page-not-found-in-vertical-orientation-for-mobile-a-vector-id1252582562?s=612x612';

document.addEventListener('DOMContentLoaded', function () {
  const $filmsListInput = document.getElementById('films-list-input');
  const $filmsAutocompleteList = document.getElementById('filmsAutocomplete-list');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');

  function closeAllLists(elmnt) {
    const $x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < $x.length; i++) {
      if (elmnt !== $x[i] && elmnt !== $filmsListInput) {
        $x[i].parentNode.removeChild($x[i]);
      }
    }
  }

  function autocomplete() {
    const $radioList = document.getElementById('radio-list');
    const $radioPosters = document.getElementById('radio-posters');
    let count = 1;
    closeAllLists();
    if (!$filmsListInput.value) {
      return false;
    }
    currentFocus = 0;
    $parentDiv.style.display = 'block';
    const $filmList = document.createElement('DIV');
    $filmList.setAttribute('id', 'autocomplete-list');
    $filmList.setAttribute('class', 'autocomplete-items');
    $parentDiv.appendChild($filmList);
    if (resultFunc.length > 0) {
      for (i = 0; i < resultFunc.length; i++) {
        const $listItem = document.createElement('DIV');
        $listItem.setAttribute('id', 'listItem' + count);
        count++;
        const $listItemInputValue = document.createElement('input');
        $listItemInputValue.type = 'hidden';
        $listItemInputValue.value = 'https://www.themoviedb.org/movie/' + resultFunc[i].id + '-' + resultFunc[i].title.replace(/[^a-zA-Z ]/g, '').replace(/ /g, '-').toLowerCase();
        $listItem.addEventListener('click', function () {
          $filmsListInput.value = this.textContent;
          document.location.href = this.getElementsByTagName('input')[0].value;
          closeAllLists();
        });
        if ($radioList.checked) {
          $listItem.innerHTML = resultFunc[i].title + ' (' + resultFunc[i].vote_average.toFixed(1) + ')';
        } else if ($radioPosters.checked) {
          $filmList.classList.add('autocomplete-posters');
          if (i > 2) break;
          const $image = document.createElement('IMG');
          if (resultFunc[i].poster_path) {
            $image.setAttribute('src', IMAGE_PATH + resultFunc[i].poster_path);
          } else {
            $image.setAttribute('src', NOT_FOUND_IMAGE_PATH);
          }
          $image.setAttribute('class', 'poster-style');
          $listItem.appendChild($image);

          const $filmTitle = document.createElement('H4');
          $filmTitle.innerHTML = resultFunc[i].title + ' ';
          $listItem.appendChild($filmTitle);

          const $filmYear = document.createElement('P');
          if (resultFunc[i].release_date) {
            $filmYear.innerHTML = resultFunc[i].release_date.slice(0, 4);
          } else {
            $filmYear.innerHTML = 'unknown';
          }
          $listItem.appendChild($filmYear);
        }
        $filmList.appendChild($listItem);
        $listItem.appendChild($listItemInputValue);
      }
    } else {
      $filmList.innerHTML = 'No results';
    }
  };

  function ajax() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_ENDPOINT + API_KEY + '&query=' + $filmsListInput.value, true);
    xhr.onload = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        resultFunc = JSON.parse(xhr.responseText).results;
        autocomplete();
      } else {
        $filmsAutocompleteList.innerHTML = 'Unable to load data';
        $filmsAutocompleteList.style.display = 'block';
      }
    };

    xhr.send();
  }

  function reqDelay() {
    clearTimeout(typingTimer);
    if ($filmsListInput.value) {
      typingTimer = setTimeout(ajax, 500);
    }
  }

  $filmsListInput.addEventListener('input', reqDelay);

  $filmsListInput.addEventListener('keydown', function (e) {
    let $autoCompleteList = document.getElementById('autocomplete-list');
    if ($autoCompleteList) $autoCompleteList = $autoCompleteList.getElementsByTagName('div');
    const filmListItem = (a) => document.getElementById('list-item' + a);

    function addActive(list) {
      if (!list) return false;
      for (let i = 0; i < $autoCompleteList.length; i++) {
        $autoCompleteList[i].classList.remove('autocomplete-active');
      }
      list.classList.add('autocomplete-active');
    }

    if (e.keyCode === 40) { //down
      if (currentFocus < $autoCompleteList.length) {
        currentFocus++;
        filmListItem(currentFocus).scrollIntoView();
        addActive(filmListItem(currentFocus));
      } else {
        currentFocus = 0;
      };
    } else if (e.keyCode === 38) { //up
      if (currentFocus > 1) {
        currentFocus--;
        filmListItem(currentFocus).scrollIntoView();
        addActive(filmListItem(currentFocus));
      };
    } else if (e.keyCode === 13) { //enter
      e.preventDefault();
      if (currentFocus > 0) {
        if ($autoCompleteList) $autoCompleteList[currentFocus - 1].click();
      }
    }
  });

  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
    $filmsAutocompleteList.style.display = 'none';
  });

  setTimeout(
    function () {
      $modal.style.display = 'block';
      $overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }, 800,
  );
});

function hide() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('keyup', function (e) {
  if (e.keyCode === 27) {
    hide();
  }
});
