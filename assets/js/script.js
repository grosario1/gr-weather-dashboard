
var apiKey = '30e0b19128baf005a61976d9fa1faeeb';

function getWeatherData(city) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var data = JSON.parse(request.responseText);
                displayWeather(data);
                saveCity(city);
                updateSavedCitiesList();
            } else {
                displayWeather(null);
            }
        }
    };
    request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric');
    request.send();
}

var form = document.getElementById('user-form');
var cityInput = document.getElementById('city-input');
var weatherDisplay = document.getElementById('weather-display');
var savedCitiesContainer = document.getElementById('saved-cities-container');