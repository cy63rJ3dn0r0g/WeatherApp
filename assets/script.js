const apiKey = "d24a9d525f5f4c6bd6a8308c5a3bedd5";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const forecastContent = document.querySelector(".forecast-content");
const timeOfDay = document.querySelector(".timeOfDay");
const weather = document.querySelectorAll(".weather");

searchForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const input = searchInput.value;
    const capitalizedInput = input.charAt(0).toUpperCase() + input.slice(1);
    const city = capitalizedInput;
    navigator.geolocation.getCurrentPosition((position) => {
      if (
        localStorage.getItem("latitude") &&
        localStorage.getItem("longtitude")
      ) {
        const latitude = localStorage.getItem("latitude");
        const longitude = localStorage.getItem("longitude");
      } else {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
      }

      fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const { lat, lon } = data[0];
          return fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
          );
        })
        .then((response) => response.json())
        .then((data) => {
          const timezoneOffset = data.timezone;
          const currentUTC = new Date(data.dt * 1000);
          const currentLocal = new Date(
            currentUTC.getTime() - timezoneOffset * 1000,
          );
          console.log(`${currentLocal}`);
          const weatherId = data.weather[0].id;
          const weatherCode = data.weather[0].main;
          const temperature = data.main.temp;
          const humidity = data.main.humidity;
          const windSpeed = data.wind.speed;
          const weatherDescription = data.weather[0].description;
          forecastContent.innerHTML = `<p>Weather for ${city}</p>
              <ul>
                <li>Temperature: ${temperature} °C</li>
                <li>Humidity: ${humidity}%</li>
                <li>Wind Speed: ${windSpeed} m/s</li>
                <li>Description: ${weatherDescription}</li>
              </ul>`;

          const setTimeBackground = (currentHour) => {
            const timeDawn = document.querySelector(".timeDawn");
            const timeDay = document.querySelector(".timeDay");
            const timeDusk = document.querySelector(".timeDusk");
            const timeNight = document.querySelector(".timeNight");

            timeDawn.style.display = "none";
            timeDay.style.display = "none";
            timeDusk.style.display = "none";
            timeNight.style.display = "none";

            if (currentHour >= 4 && currentHour < 6) {
              timeDawn.style.display = "block";
            } else if (currentHour >= 6 && currentHour < 19) {
              timeDay.style.display = "block";
            } else if (currentHour >= 19 && currentHour < 20) {
              timeDusk.style.display = "block";
            } else {
              timeNight.style.display = "block";
            }
          };
          const currentHour = currentLocal.getHours();
          setTimeBackground(currentHour);

          const setWeatherBackground = (weatherId) => {
            const cloudy = document.querySelector(".cloudy");
            const snow = document.querySelector(".snow");
            const rainy = document.querySelector(".rainy");
            const foggy = document.querySelector(".foggy");
            const thunderstorm = document.querySelector(".thunder");
            const drizzle = document.querySelector(".drizzle");
            const overcast = document.querySelector(".overcast");
            const mountainSnowDay = document.querySelector(".mountainSnowDay");
            const timeDay = document.querySelector(".timeDay");
            const foggyDawn = document.querySelector(".mountainFoggyDawn");
            const foggyDay = document.querySelector(".mountainFoggyDay");
            const foggyDusk = document.querySelector(".mountainFoggyDusk");

            rainy.style.display = "none";
            foggy.style.display = "none";
            thunderstorm.style.display = "none";
            cloudy.style.display = "none";
            overcast.style.display = "none";
            snow.style.display = "none";
            drizzle.style.display = "none";
            mountainSnowDay.style.display = "none";

            if (weatherId >= 803 && weatherId <= 804) {
              cloudy.style.display = "block";
            } else if (weatherId >= 801 && weatherId <= 802) {
              overcast.style.display = "block";
            } else if (weatherId >= 200 && weatherId <= 232) {
              thunderstorm.style.display = "block";
              timeDay.style.setProperty('--rain', 'linear-gradient(180deg, rgb(18, 88, 146) 0%, rgb(4, 66, 148) 100%)');
            } else if (weatherId >= 300 && weatherId <= 321) {
              drizzle.style.display = "block";
            } else if (weatherId >= 500 && weatherId <= 531) {
              rainy.style.display = "block";
            } else if (weatherId >= 701 && weatherId <= 781) {
              if (currentHour >= 4 && currentHour < 6) {
                foggyDawn.style.display = "block";
              } else if (currentHour >= 6 && currentHour < 19) {
                foggyDay.style.display = "block";
              } else if (currentHour >= 19 && currentHour < 20) {
                foggyDusk.style.display = "block";
              } else {
                timeNight.style.display = "block";
              }
            } else if (weatherId >= 600 && weatherId <= 622) {
              snow.style.display = "block";
              mountainSnowDay.style.display = "block";
            }
          };
          setWeatherBackground(weatherId);
        });
    });
  },
  (error) => {
    console.error(error.message);
  },
);
