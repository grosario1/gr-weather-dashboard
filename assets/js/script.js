
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
  
  function celsiusToFahrenheit(temperatureCelsius) {
    return (temperatureCelsius * 9/5) + 32;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (!city) {
      return;
    }
  
    getWeatherData(city);
  }

  form.addEventListener('submit', handleFormSubmit);

