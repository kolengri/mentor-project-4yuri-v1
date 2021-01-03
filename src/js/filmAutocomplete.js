import $ from 'jquery';
import { formatReleaseDate } from './formatRelease';

import 'jquery-ui/ui/widgets/autocomplete';

const apiKey = '35c2658e0e706d145f4d4f7e995e368f';

$(() => {
  $('#filmsList').autocomplete({
    minLength: 2,
    source(req, res) {
      const val = $('#filmsList').val();

      $.ajax({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${val}`,
        success(data) {
          const result = data.results.map(film => {
            const date = formatReleaseDate(film.release_date, "yyyy")
            return ({
              label: `${film.title} (${film.vote_average.toFixed(1)}) date: ${date}`,
              value: film.id,
            })
          });

          res(result, () => {
            console.log('Unable to load data');
          });
        },
      });
    },
    focus(event) {
      event.preventDefault();
    },
    // Once a value in the drop down list is selected, do the following:
    select(event, ui) {
      event.preventDefault();
      // place the value into the textfield called 'select_origin'...
      $('#filmsList').val(ui.item.label);
      // ... any other tasks (like setting Hidden Fields) go here...
    },
  });
});
