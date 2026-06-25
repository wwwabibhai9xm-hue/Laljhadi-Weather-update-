// ===============================
// WEATHERPRO V2
// ===============================

// Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");

// -------------------------------
// PAGE SWITCHING
// -------------------------------
const pages = {
  todayPage: document.getElementById("todayPage"),
  hourlyPage: document.getElementById("hourlyPage"),
  dailyPage: document.getElementById("dailyPage"),
  radarPage: document.getElementById("radarPage"),
  climatePage: document.getElementById("climatePage")
};

const navButtons = document.querySelectorAll(".nav-item");

function showPage(pageId) {
  Object.values(pages).forEach(page => {
    if (page) page.style.display = "none";
  });

  if (pages[pageId]) {
    pages[pageId].style.display = "block";
  }

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

showPage("todayPage");

// -------------------------------
// GET COORDINATES
// -------------------------------
async function getCoordinates(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    alert("City not found!");
    return null;
  }

  return {
    name: data.results[0].name,
    lat: data.results[0].latitude,
    lon: data.results[0].longitude
  };
}

// -------------------------------
// GET WEATHER
// -------------------------------
async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
  );

  return await response.json();
}

// -------------------------------
// UPDATE TODAY
// -------------------------------
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

// -------------------------------
// HOURLY FORECAST
// -------------------------------
function loadHourly(data) {
  const container =
    document.getElementById("hourlyForecast");

  container.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const time =
      data.hourly.time[i].slice(11, 16);

    const temp =
      data.hourly.temperature_2m[i];

    const rain =
      data.hourly.precipitation_probability[i];

    container.innerHTML += `
      <div class="forecast-card">
        <h4>${time}</h4>
        <p>🌡️ ${temp}°C</p>
        <p>🌧️ ${rain}%</p>
      </div>
    `;
  }
}

// -------------------------------
// DAILY FORECAST
// -------------------------------
function loadDaily(data) {
  const container =
    document.getElementById("dailyForecast");

  container.innerHTML = "";

  for (let i = 0; i < data.daily.time.length; i++) {
    const date = data.daily.time[i];
    const max =
      data.daily.temperature_2m_max[i];

    const min =
      data.daily.temperature_2m_min[i];

    const rain =
      data.daily
        .precipitation_probability_max[i];

    container.innerHTML += `
      <div class="forecast-card">
        <h4>${date}</h4>
        <p>🌡️ ${max}°C / ${min}°C</p>
        <p>🌧️ ${rain}% chance of rain</p>
      </div>
    `;
  }
}

// -------------------------------
// LOAD CITY WEATHER
// -------------------------------
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
  } catch (error) {
    console.log(error);

    description.textContent =
      "Unable to load weather ❌";
  }
}

// -------------------------------
// SEARCH BUTTON
// -------------------------------
searchBtn.addEventListener(
  "click",
  () => {
    const city =
      cityInput.value.trim();

    if (!city) {
      alert("Enter a city name");
      return;
    }

    loadCity(city);
  }
);

// -------------------------------
// DEFAULT CITY
// -------------------------------
loadCity("Kathmandu");
