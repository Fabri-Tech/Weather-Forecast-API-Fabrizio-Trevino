//this will make the API key work and fetch the info

var apiKey = 'db5697dd16d678d892b35d89de106ad4';
var apiUrlCurrent = 'https://api.openweathermap.org/data/2.5/weather';
var apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
var searchHistory = [];

$(document).ready(function() {
  $('#search-button').click(function() {
    var city = $('#city-name').val();

    // add city to search history
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      $('#search-history').append('<p class="city-history" data-city="' + city + '">' + city + '</p>');
    }

    // this will obtain the current weather
    $.ajax({
      url: apiUrlCurrent, // this will grab the current weather
      data: {
        q: city,
        appid: apiKey //this will grab the apikey
      },
      success: function(data) { //if the city is found it will load the information
        var weather = data.weather[0];
        var temp = data.main.temp;
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;
        var date = new Date();
        var iconUrl = 'http://openweathermap.org/img/wn/' + weather.icon + '@2x.png'; //this will obtain the icons for the current weather
        $('#city-name-current').html(data.name);
        $('#date').html(date.toDateString());
        $('#weather-icon-current').attr('src', iconUrl);
        $('#temperature').html('Temperature: ' + (temp-273.15).toFixed(2) + '°C'); //the temperature is in Kelvin by default, we need to change it to celcius
        $('#humidity').html('Humidity: ' + humidity + '%');
        $('#wind-speed').html('Wind Speed: ' + windSpeed + ' m/s');
      },
      error: function(){
        $('#current-weather').html("<h2>City not found</h2>"); // in case city is not found the webpage will show this message
      }
    });

    // this will obtain the weather for the other days
    $.ajax({
      url: apiUrlForecast,
      data: {
        q: city,
        appid: apiKey
      },
      success: function(data) {
        $('#city-name-forecast').html(data.city.name);
        for (var i = 0; i < data.list.length; i += 8) {
          var forecast = data.list[i];
          var forecastDate = new Date(forecast.dt * 1000);
          var forecastIconUrl = 'http://openweathermap.org/img/wn/' + forecast.weather[0].icon + '@2x.png';
          $('#forecast-date-'+(i/8+1)).html(forecastDate.toDateString());
          $('#forecast-icon-'+(i/8+1)).attr('src', forecastIconUrl);
          $('#forecast-temperature-'+(i/8+1)).html('Temperature: ' + (forecast.main.temp - 273.15).toFixed(2) + '°C'); //the temperature is in Kelvin by default, we need to change it to celcius
          $('#forecast-humidity-'+(i/8+1)).html('Humidity: ' + forecast.main.humidity + '%');
          $('#forecast-wind-speed-'+(i/8+1)).html('Wind Speed: ' + forecast.wind.speed + ' m/s');
        }
      },
      error: function(){
        $('#forecast-weather').html("<h2>City not found</h2>"); // in case the city is not found it will show this message
      }
    });
  });

  // click button to search the city
  $('#search-history').on('click', '.city-history', function() {
    var city = $(this).data('city');
    $('#city-name').val(city);
    $('#search-button').click();
  });
});


$(document).ready(function() {
    // this will check if the city is stored in the local storage
    if (localStorage.getItem('searchHistory')) {
      var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
      for (var i = 0; i < searchHistory.length; i++) {
        var city = searchHistory[i];
        $('#search-history').append("<p class='city-history' data-city='" + city + "'>" + city + "</p>");
      }
    } else {
      
      var searchHistory = [];
    }
  
    // handle click event on search button
    $('#search-button').click(function() {
      var city = $('#city-name').val();
  
      // confirm if the city has already been searched
      if (searchHistory.indexOf(city) === -1) {
        searchHistory.push(city);
        $('#search-history').append("<p class='city-history' data-city='" + city + "'>" + city + "</p>");
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      }
      
    });
  
    // this will keep the Search history even if the page is reloaded or closed
    $('#search-history').on('click', '.city-history', function() {
      var city = $(this).data('city');
      $('#city-name').val(city);
      $('#search-button').click();
    });
  });
  