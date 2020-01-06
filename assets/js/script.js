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
let cardDeckEl = $('.card-deck')
let cityArr = JSON.parse(localStorage.getItem("cityArr")) || [];

let lastSearchedCity = JSON.parse(localStorage.getItem("lastSearchedCity"))
var APIKey = "eeca3fbc8f6a388ada5c13880dd30b30";

//Functions
let mainCardCall = function(city) {
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
      $("#mainCity").text(response.name + ' (' + today + ')');
      $('#mainIcon').attr('src', `http://openweathermap.org/img/w/${response.weather[0].icon}.png`)
      $('#mainIcon').attr('alt', `${response.weather[0].description}`)
      $("#mainTemp").text("Temperature: " + Math.round(response.main.temp) + " °F");
      $("#mainHumidity").text("Humidity: " + response.main.humidity + '%');
      $("#mainWind").text("Wind Speed: " + Math.round(response.wind.speed) + 'MPH');
      // Converts the temp to Kelvin with the below formula
      var tempF = (response.main.temp - 273.15) * 1.80 + 32;
      $(".tempF").text("Temperature (Kelvin) " + tempF);

      //UV Index API call and appending functionality
      var queryURLuv = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${APIKey}&lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=1`
      $.ajax({
        url: queryURLuv,
        method: "GET"
      })
      .then(function(resp) {
        $('#mainUv').text("UV Index: " + resp[0].value)
      })
  });

}

function loadSearchedCities () {

  $.each(cityArr, function (index, object) {

    let newItem = $(`<li class="list-group-item list-group-item-action">`)
    newItem.text(object.city)
    listGroupEl.append(newItem)

  })
}

function fiveDayCall (city) {

  forecastURL = `http://api.openweathermap.org/data/2.5/forecast?appid=${APIKey}&q=${city}`
  cardDeckEl.empty();

  $.ajax({
    url: forecastURL,
    method: "GET"
    })
    .then(function(forecast) {
      console.log(forecast)


      for (var i=1; i<6; i++) {
        let newCard = $(`<div class="card bg-primary text-white"></div>`)
        let newCardBody = $(`<div class="card-body"></div>`)
        let newDate = $(`<h5 class="card-title"></h5>`)
        let newIcon = $(`<img src="" alt="">`)
        let newTemp = $(`<p class="card-text"></p>`)
        let newHumidity = $(`<p class="card-text"></p>`)

        newDate.text(forecast.list[i].dt_txt.slice(0, -9))
        newIcon.attr('src', `http://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png`)
       
        var tempF = (forecast.list[i].main.temp - 273.15) * 1.80 + 32;
        newTemp.text("Temperature: " + Math.round(tempF) + " °F")
        newHumidity.text("Humidity: " + forecast.list[i].main.humidity + '%')
        cardDeckEl.append(newCard)
        newCard.append(newCardBody)
        newCardBody.append(newDate, newIcon, newTemp, newHumidity)
      }




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
    fiveDayCall(city)
  }
  //Create and push object searched to Localstorage
  let cityJSON = {
    city: city
  }

  cityArr.push(cityJSON)
  localStorage.setItem('cityArr', JSON.stringify(cityArr))
  localStorage.setItem('lastSearchedCity', JSON.stringify(city))
})


listGroupEl.click(function (e) {
  event.preventDefault()
  elData = $(e.target).text()
  searchCity.val('')
  mainCardCall(elData)
  fiveDayCall(elData)
  localStorage.setItem('lastSearchedCity', JSON.stringify(elData))
})



loadSearchedCities()
mainCardCall(lastSearchedCity)
fiveDayCall(lastSearchedCity)