
  const apiKey = '43b27f0da1a54e81a35a7fb5a0ef29a2';
  let cityInput = document.getElementById('cityInput');
  let searchButton = document.getElementById('searchButton');
  let cityInfo = document.getElementById('cityInfo');

  searchButton.addEventListener('click', () => {
    const cityName = cityInput.value;

    citySearch(cityName);
  });
  
  cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      citySearch(cityInput.value);
    }
  });
  searchButton.addEventListener('click', () => {
    const cityName = cityInput.value;

    citySearch(cityName);
  });


  function citySearch(cityName) {
    const limit = 1;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const lat = data[0].lat;
        const lon = data[0].lon;
        
        weather(lat, lon);
        
        forecast(lat, lon);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function weather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.rain);
        const temperatureFahrenheit = data.main.temp;
        console.log('Temperature in Fahrenheit:', temperatureFahrenheit);

        const temperatureElement = document.getElementById('temperature');
        temperatureElement.textContent = `${temperatureFahrenheit.toFixed(2)}°F`;

        const cityName = data.name;
        const cityInfoElement = document.getElementById('cityInfo');
        cityInfoElement.textContent = `${cityName} 
        Current Temperature: `;

        const sunriseTime = data.sys.sunrise * 1000;
        const sunsetTime = data.sys.sunset * 1000;
        const currentTime = new Date().getTime();

        const isDayTime = currentTime >= sunriseTime && currentTime <= sunsetTime;
        const weatherIconElement = document.getElementById('weatherIcon');

        if (isDayTime) {
          weatherIconElement.src = './Assets/day-icon.png';
          weatherIconElement.alt = 'Day Icon';
        } else {
          weatherIconElement.src = './Assets/night-icon.png';
          weatherIconElement.alt = 'Night Icon';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

function forecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const forecastList = data.list;

        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        const forecastByDay = {};
        forecastList.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const forecastDate = date.toDateString();

          if (!forecastByDay[forecastDate]) {
            forecastByDay[forecastDate] = forecast;
          }
        });

        const forecastEntries = Object.values(forecastByDay).slice(0, 5);

        forecastEntries.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);

          const forecastEntry = document.createElement('div');
          forecastEntry.innerHTML = `
            <span id="date">${date.toDateString()}</span></p>
            <p>Max Temperature: <span class="forecast">${forecast.main.temp_max}</span> °F</p>
            <p>Min Temperature: <span class="forecast">${forecast.main.temp_min}</span> °F</p>
          `;

          forecastContainer.appendChild(forecastEntry);
        });
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  }

