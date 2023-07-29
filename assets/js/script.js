
var apiKey = '30e0b19128baf005a61976d9fa1faeeb';

function getWeatherData(city) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          displayWeather(data);
          getForecastData(data.coord.lat, data.coord.lon);
          saveCity(city);
          updateSavedCitiesList();
        } else {
          displayWeather(null);
          displayForecast(null); // Clear forecast display in case of error
        }
      }
    };
    request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric');
    request.send();
  }

var form = document.getElementById('user-form');
var cityInput = document.getElementById('city-input');

function displayWeather(data) {
    var weatherInfoHTML = '';
    if (!data) {
        weatherInfoHTML = '<p>City not found.</p>';
    } else {
        var cityName = data.name;
        var date = new Date(data.dt * 1000).toLocaleDateString('en-US');
        var iconCode = data.weather[0].icon;
        var temperatureCelsius = data.main.temp;
        var temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        weatherInfoHTML = `
        <div class="weather-info">
          <h2>${cityName} (${date})</h2>
          <div>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
            <p>Temperature: ${temperatureFahrenheit} °F</p>
            <p>Humidity: ${humidity} %</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
          </div>
        </div>
      `;
    }

    weatherDisplay.innerHTML = weatherInfoHTML;
}

var weatherDisplay = document.getElementById('weather-display');

function celsiusToFahrenheit(temperatureCelsius) {
    return (temperatureCelsius * 9 / 5) + 32;
}

var forecastDisplay = document.getElementById('forecast-display');

function getForecastData(latitude, longitude) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          displayForecast(data);
        } else {
          displayForecast(null); 
        }
      }
    };
    request.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey + '&units=metric');
    request.send();
  }

function displayForecast(data) {
    var forecastInfoHTML = '';
    if (!data) {
      forecastInfoHTML = '<p>Forecast not available.</p>';
    } else {
      var forecastList = data.list;
      forecastInfoHTML += '<div class="forecast-container">';
      for (var i = 0; i < 5; i++) {
        var date = new Date(forecastList[i].dt * 1000).toLocaleDateString('en-US');
        var iconCode = forecastList[i].weather[0].icon;
        var temperatureCelsius = forecastList[i].main.temp;
        var temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);
  
        forecastInfoHTML += `
          <div class="forecast-item">
            <p>${date}</p>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
            <p>Temperature: ${temperatureFahrenheit} °F</p>
          </div>
        `;
      }
      forecastInfoHTML += '</div>';
    }
  
    forecastDisplay.innerHTML = forecastInfoHTML;
  }

function handleFormSubmit(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (!city) {
        return;
    }

    getWeatherData(city);
}

var savedCitiesContainer = document.getElementById('saved-cities-container');

function saveCity(city) {
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

function updateSavedCitiesList() {
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    var savedCitiesHTML = '';
    for (var i = 0; i < savedCities.length; i++) {
        savedCitiesHTML += `
        <button class="btn btn-secondary mr-2 mb-2 saved-city" data-city="${savedCities[i]}">${savedCities[i]}</button>
      `;
    }
    savedCitiesContainer.innerHTML = savedCitiesHTML;
}

function handleSavedCityClick(event) {
    if (event.target.classList.contains('saved-city')) {
        var city = event.target.getAttribute('data-city');
        getWeatherData(city);
    }
}

savedCitiesContainer.addEventListener('click', handleSavedCityClick);

updateSavedCitiesList();

form.addEventListener('submit', handleFormSubmit);

