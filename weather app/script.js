const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');
const currentLocation = document.querySelector('.current-location');
const currentWeatherDiv = document.querySelector('.current-weather');
const weatherCardsDiv = document.querySelector('.weather-cards');

const API_KEY = '77c207714eda9321f2e25e0befd65b13';

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details">
    <h2>${cityName} (${weatherItem.dt_txt.split(' ')[0]})</h2>
    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    <div class= "icon">
    <img src="https://openweathermap.org/img/wn/${
      weatherItem.weather[0].icon
    }@2x.png" alt="weather-icon"> 
    <h4>${weatherItem.weather[0].description}</h4>
    </div>
</div>`;
  } else {
    return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(' ')[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${
      weatherItem.weather[0].icon
    }@2x.png" alt="weather-icon">
    <h4>${(weatherItem.main.temp - 273.15).toFixed(2)}ºC </h4>
    <h4> ${weatherItem.wind.speed} M/S</h4>
    <h4>${weatherItem.main.humidity}%</h4>
  </li>`;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=77c207714eda9321f2e25e0befd65b13`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      const threeDaysForecast = [];

      data.list.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();

        if (
          !uniqueForecastDays.includes(forecastDate) &&
          threeDaysForecast.length < 4
        ) {
          uniqueForecastDays.push(forecastDate);
          threeDaysForecast.push(forecast);
        }
      });

      cityInput.value = '';
      weatherCardsDiv.innerHTML = '';
      currentWeatherDiv.innerHTML = '';

      threeDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            'beforeend',
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            'beforeend',
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert('error occurred while fetching the weather forecast!');
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=77c207714eda9321f2e25e0befd65b13`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0)
        return alert(`no coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
      console.log(data);
    })
    .catch(() => {
      alert('error occured while fetching  the coordinates!');
    });

  console.log(cityName);
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `httpS://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=77c207714eda9321f2e25e0befd65b13`;
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
          console.log(data);
        })
        .catch(() => {
          alert('error occured while fetching  the city!');
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert('geolocation denied');
      }
    }
  );
};

currentLocation.addEventListener('click', getUserCoordinates);
searchButton.addEventListener('click', getCityCoordinates);
