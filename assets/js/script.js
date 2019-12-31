var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

var APIKey = "eeca3fbc8f6a388ada5c13880dd30b30";

// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
  "q=London&units=imperial&appid=" + APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
  url: queryURL,
  method: "GET"
})
  // We store all of the retrieved data inside of an object called "response"
  .then(function(response) {

    // Log the queryURL
    console.log(queryURL);

    // Log the resulting object
    console.log(response);

    // Transfer content to HTML
    $("#mainCity").text(response.name + ' (' + today + ')' + response.weather[0].icon);
    $("#mainTemp").text("Temperature: " + Math.round(response.main.temp) + " °F");
    $("#mainHumidity").text("Humidity: " + response.main.humidity + '%');
    $("#mainWind").text("Wind Speed: " + Math.round(response.wind.speed) + 'MPH');

    // Converts the temp to Kelvin with the below formula
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".tempF").text("Temperature (Kelvin) " + tempF);

    // Log the data in the console as well
  });
