//Set date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

//HTML Elements
let searchCity = $('#searchCity')
let searchBtnEl = $('#searchBtn')
let listGroupEl = $('.list-group')
let cityArr = JSON.parse(localStorage.getItem("citiesArr")) || [];

let mainCardCall = function(city) {
  var APIKey = "eeca3fbc8f6a388ada5c13880dd30b30";
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

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

  });

}

//OnClick Elements

searchBtnEl.click(function () {
  event.preventDefault()
  let city = searchCity.val()
  if (!city) {
    alert("No City Search Detected")
  } else {
    mainCardCall(city)
    let newItem = $(`<li class="list-group-item list-group-item-action">`)
    newItem.text(city)
    listGroupEl.append(newItem)
  }


  localStorage.setItem('city', JSON.stringify(cityArr))
})


listGroupEl.click(function (e) {
  event.preventDefault()
  elData = $(e.target).text()
  searchCity.val('')
  mainCardCall(elData)
})

