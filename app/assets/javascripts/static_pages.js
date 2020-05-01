$(document).ready(function () {
  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("weatherSearch")) || [];

  $("#search-button").on("click", function () {
    var city = $("#city").val();
    var address = $("#address").val();

    searchWeather(address, city);
  });

  function searchWeather(address, city) {
    // check local storage for cached address
    for (var i = 0; i < history.length; i++) {
      if (Object.keys(history[i]).includes(address)) {
        // populateWeather creates our card for todays weather
        populateWeather(history[i][address]);
        // getForecast creates 5 additional cards for 5day forecast
        getForecast(history[i][address].city);
        return;
      }
    }

    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=039caae4e6460883b9440700adbdd04c&units=imperial",
      dataType: "json",
      success: function (data) {
        // city later used to populate sidebar cache
        data.city = city;
        // createdAt used to remove entries from cache after 30 minutes
        data.createdAt = new Date().getTime();

        // add new api response to localStorage array
        var obj = {};
        obj[address] = data;
        history.push(obj);
        window.localStorage.setItem("weatherSearch", JSON.stringify(history));

        populateWeather(data);
        getForecast(city);
        makeRow(address, city);
      },
      error: function () {
        $("#forecast").empty();
        $("#today").html("<h2>No results found for that address.</h2>");
      },
    });
  }

  function populateWeather(data) {
    // clear any old content
    $("#today").empty();
    // create html content for current weather
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var title = $("<h3>")
      .addClass("card-title")
      .text(data.name + " (" + new Date().toLocaleDateString() + ")");
    var temp = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + data.main.temp + " °F");
    var humidity = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + data.main.humidity + "%");
    var wind = $("<p>")
      .addClass("card-text")
      .text("Wind Speed: " + data.wind.speed + " MPH");
    var img = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    );

    // merge and add to page
    title.append(img);
    cardBody.append(title, temp, humidity, wind);
    card.append(cardBody);
    $("#today").append(card);

    // clear input boxes
    $("#address").val("");
    $("#city").val("");
  }

  function getForecast(city) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=039caae4e6460883b9440700adbdd04c&units=imperial",
      dataType: "json",
      success: function (data) {
        // overwrite any existing content with title and empty row
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast:</h4>')
          .append('<div class="row">');

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only create cards for forecasts at 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var cardBody = $("<div>").addClass("card-body p-2");

            var title = $("<h5>")
              .addClass("card-title")
              .text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr(
              "src",
              "https://openweathermap.org/img/w/" +
                data.list[i].weather[0].icon +
                ".png"
            );

            var temp = $("<p>")
              .addClass("card-text")
              .text("Temp: " + data.list[i].main.temp_max + " °F");
            var humidity = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and add to page
            cardBody.append(title, img, temp, humidity);
            card.append(cardBody);
            col.append(card);
            $("#forecast .row").append(col);
          }
        }
      },
    });
  }

  function makeRow(address, city) {
    // add list item to history sidebar
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action cursor-pointer")
      .html(address + ", " + city)
      .data("address", address)
      .data("city", city);

    $(".history").append(li);
  }

  $(".history").on("click", "li", function () {
    searchWeather($(this).data("address"), $(this).data("city"));
  });

  // to run on page load
  (function () {
    for (var i = 0; i < history.length; i++) {
      var address = Object.keys(history[i])[0];

      var createdAt = history[i][address].createdAt;
      var thirtyMin = 30 * 60 * 1000;

      // Removed cached searches after 30 minutes
      if (new Date().getTime() - createdAt > thirtyMin) {
        history.splice(i, 1);
        continue;
      }

      // add recent searches to sidebar
      var city = history[i][address].city;
      makeRow(address, city);

      // populate dashboard with most recent weather search
      if (i === history.length - 1) {
        populateWeather(history[i][address]);
        getForecast(city);
      }
    }

    window.localStorage.setItem("weatherSearch", JSON.stringify(history));
  })();
});
