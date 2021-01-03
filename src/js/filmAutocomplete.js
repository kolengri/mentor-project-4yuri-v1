const $ = require("jquery");
require("jquery-ui")

const apiKey = "35c2658e0e706d145f4d4f7e995e368f"

$('#filmsList').autocomplete({
    minLength: 2,
    source: function (req, res) {
        $.ajax({
            url: "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + $("#filmsList").val(),
            success: function (data) {
                const result = data.results.map(function (film) {
                    return {
                        label: film.title + " (" + film.vote_average.toFixed(1) + ")",
                        value: film.id
                    };
                });


                res(result,  function () {
                    console.log("Unable to load data");
                })
            }
        })
    },
    focus: function (event, ui) {
        event.preventDefault();
    },
    // Once a value in the drop down list is selected, do the following:
    select: function (event, ui) {
        event.preventDefault();
        // place the value into the textfield called 'select_origin'...
        $('#filmsList').val(ui.item.label);
        // ... any other tasks (like setting Hidden Fields) go here...
    }
})
