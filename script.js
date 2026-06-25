// =====================
// PAGE SWITCHING
// =====================

const pages = {
  todayPage: document.getElementById("todayPage"),
  hourlyPage: document.getElementById("hourlyPage"),
  dailyPage: document.getElementById("dailyPage"),
  radarPage: document.getElementById("radarPage"),
  climatePage: document.getElementById("climatePage")
};

const navButtons =
document.querySelectorAll(".nav-item");

function showPage(pageId) {

  Object.values(pages).forEach(page => {
    page.style.display = "none";
  });

  pages[pageId].style.display = "block";

  navButtons.forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.page === pageId) {
      btn.classList.add("active");
    }
  });
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

// =====================
// WEATHER
// =====================

const cityName =
document.getElementById("cityName");

const temperature =
document.getElementById("temperature");

const description =
document.getElementById("description");

const feelsLike =
document.getElementById("feelsLike");

const humidity =
document.getElementById("humidity");

const wind =
document.getElementById("wind");

const rain =
document.getElementById("rain");

const cityInput =
document.getElementById("cityInput");

const searchBtn =
document.getElementById("searchBtn");

// Get Coordinates
async function getCoordinates(city) {

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );

  const data = await res.json();

  if (!data.results) {
    alert("City not found");
    return null;
  }

  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    name: data.results[0].name
  };
}

// Get Weather
async function getWeather(lat, lon) {

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
  );

  return await res.json();
}

// Update Today
function updateToday(data, name) {

  const current = data.current;

  cityName.textContent = name;

  temperature.textContent =
    current.temperature_2m + "°C";

  feelsLike.textContent =
    current.apparent_temperature + "°";

  humidity.textContent =
    current.relative_humidity_2m + "%";

  wind.textContent =
    current.wind_speed_10m + " km/h";

  rain.textContent =
    current.precipitation_probability + "%";

  description.textContent =
    "Live weather updated ✔";
}

// Hourly Forecast
function loadHourly(data) {

  const box =
  document.getElementById(
    "hourlyForecast"
  );

  box.innerHTML = "";

  for (let i = 0; i < 12; i++) {

    box.innerHTML += `
      <div class="forecast-card">
        <h4>
          ${data.hourly.time[i].slice(11,16)}
        </h4>

        <p>
          🌡️
          ${data.hourly.temperature_2m[i]}°C
        </p>

        <p>
          🌧️
          ${data.hourly.precipitation_probability[i]}%
        </p>
      </div>
    `;
  }
}

// Daily Forecast
function loadDaily(data) {

  const box =
  document.getElementById(
    "dailyForecast"
  );

  box.innerHTML = "";

  for (
    let i = 0;
    i < data.daily.time.length;
    i++
  ) {

    box.innerHTML += `
      <div class="forecast-card">

        <h4>
          ${data.daily.time[i]}
        </h4>

        <p>
          🌡️
          ${data.daily.temperature_2m_max[i]}°
          /
          ${data.daily.temperature_2m_min[i]}°
        </p>

        <p>
          🌧️
          ${data.daily.precipitation_probability_max[i]}%
        </p>

      </div>
    `;
  }
}

// Climate Statistics
function loadClimate(data) {

  document.getElementById(
    "climateStats"
  ).innerHTML = `

    <div class="forecast-card">

      <p>
        🌡️ Temperature:
        ${data.current.temperature_2m}°C
      </p>

      <p>
        🤗 Feels Like:
        ${data.current.apparent_temperature}°C
      </p>

      <p>
        💧 Humidity:
        ${data.current.relative_humidity_2m}%
      </p>

      <p>
        💨 Wind:
        ${data.current.wind_speed_10m} km/h
      </p>

      <p>
        🌧️ Rain Probability:
        ${data.current.precipitation_probability}%
      </p>

    </div>
  `;
}

// Load City
async function loadCity(city) {

  try {

    description.textContent =
      "Loading weather...";

    const coords =
      await getCoordinates(city);

    if (!coords) return;

    const data =
      await getWeather(
        coords.lat,
        coords.lon
      );

    updateToday(data, coords.name);
    loadHourly(data);
    loadDaily(data);
    loadClimate(data);

  } catch (e) {
    description.textContent =
      "Unable to load weather ❌";
  }
}

// Search
searchBtn.addEventListener(
  "click",
  () => {

    const city =
      cityInput.value.trim();

    if (!city) return;

    loadCity(city);
  }
);

// Default Weather
loadCity("Kathmandu");

// Open Today page
showPage("todayPage");
