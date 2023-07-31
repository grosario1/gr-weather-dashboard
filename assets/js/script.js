
var apiKey = '30e0b19128baf005a61976d9fa1faeeb';

// Function to get weather data for the city entered using the listed OpenWeather api. 

function getWeatherData(city) {
    var request = new XMLHttpRequest();
    // THis is a callback function 
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            // Checks is the api returns a response successfully. If succesfull, capture the data into a variable and parse the JSON output to get the city's coordinates.
            // Saves the city input
            if (request.status === 200) {
                var data = JSON.parse(request.responseText);
                displayWeather(data);
                getForecastData(data.coord.lat, data.coord.lon);
                saveCity(city);
                updateSavedCitiesList();
            } else {
                displayWeather(null); // Clear weather display in case of error
                displayForecast(null); // Clear forecast display in case of error
            }
        }
    };
    request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric');
    request.send();
}


var form = document.getElementById('user-form');
var cityInput = document.getElementById('city-input');

// This function displays the weather info within the weather display card
function displayWeather(data) {
    var weatherInfoHTML = '';
    if (!data) {
        weatherInfoHTML = '<p>City not found.</p>';
    } else {
        // weather information from the API response & adds into a variable to use in places within the code
        var cityName = data.name;
        var date = new Date(data.dt * 1000).toLocaleDateString('en-US');
        var iconCode = data.weather[0].icon;
        var temperatureCelsius = data.main.temp;
        var temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        // Populates the html elements needed to display the weather info within the page
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
    // this displays the info on the page
    weatherDisplay.innerHTML = weatherInfoHTML;
}

var weatherDisplay = document.getElementById('weather-display');

// Function to conver the temperature value from celsius to Fahrenheit
function celsiusToFahrenheit(temperatureCelsius) {
    return (temperatureCelsius * 9 / 5) + 32;
}

var forecastDisplay = document.getElementById('forecast-display');

// Function to get 5 day forecast of the city from the openWeathermap api
function getForecastData(latitude, longitude) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
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

// 
function displayForecast(data) {
    var forecastInfoHTML = '';
    if (!data) {
        forecastInfoHTML = '<p>Forecast not available.</p>';
    } else {
        var forecastList = data.list;
        var currentDate = new Date(forecastList[0].dt * 1000).toLocaleDateString('en-US');
        forecastInfoHTML += '<h3 class="text-black-50">5-Day Forecast:</h3><div class="row forecast-container">';
        for (var i = 0; i < 5; i++) {
            var date = new Date(currentDate);
            date.setDate(date.getDate() + i + 1);
            date = date.toLocaleDateString('en-US');
            var iconCode = forecastList[i].weather[0].icon;
            var temperatureCelsius = forecastList[i].main.temp;
            var temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);
            var humidity = forecastList[i].main.humidity;
            var windSpeed = forecastList[i].wind.speed;
            // this generates the html element needed to display the 5 day forecast cards
            var forecastItemHTML = `
                <div class="col-md-2 mb-4">
                    <div class="card forecast-item">
                        <p>${date}</p>
                        <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
                        <p>Temperature: ${temperatureFahrenheit} °F</p>
                        <p>Humidity: ${humidity} %</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                    </div>
                </div>
            `;
            forecastInfoHTML += forecastItemHTML;
        }
        forecastInfoHTML += '</div>';
    }
    // this displays the info on the page
    forecastDisplay.innerHTML = forecastInfoHTML;
}

// Funcrtion to handle the submit of the city entered
function handleFormSubmit(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (!city) {
        return;
    }

    getWeatherData(city);
}

var savedCitiesContainer = document.getElementById('saved-cities-container');

// Function to save the search city into localstorage
function saveCity(city) {
    var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

// Function to update the list of the previous saved cities and display on the page
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

// Function to handle clicks on the saved city buttons and display weather and forecast data
function handleSavedCityClick(event) {
    if (event.target.classList.contains('saved-city')) {
        var city = event.target.getAttribute('data-city');
        getWeatherData(city);
    }
}

savedCitiesContainer.addEventListener('click', handleSavedCityClick);

updateSavedCitiesList();

form.addEventListener('submit', handleFormSubmit);

