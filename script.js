// ===============================
// WEATHERPRO V2 - PAGE SWITCHING
// ===============================

// Get all pages
const pages = {
  todayPage: document.getElementById("todayPage"),
  hourlyPage: document.getElementById("hourlyPage"),
  dailyPage: document.getElementById("dailyPage"),
  radarPage: document.getElementById("radarPage"),
  climatePage: document.getElementById("climatePage"),
};

// Get nav buttons
const navButtons = document.querySelectorAll(".nav-item");

// Function to show page
function showPage(pageId) {
  // Hide all pages
  Object.values(pages).forEach(page => {
    if (page) page.style.display = "none";
  });

  // Show selected page
  if (pages[pageId]) {
    pages[pageId].style.display = "block";
  }

  // Update active button
  navButtons.forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.page === pageId) {
      btn.classList.add("active");
    }
  });
}

// Add click events to nav buttons
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = btn.dataset.page;
    showPage(pageId);
  });
});


// ===============================
// DEFAULT PAGE ON LOAD
// ===============================
showPage("todayPage");


// ===============================
// WEATHER API (OPEN-METEO BASIC FIX)
// ===============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");

// Simple geocoding (Open-Meteo)
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results) {
    alert("City not found!");
    return null;
  }

  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    name: data.results[0].name
  };
}

// Fetch weather
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  const res = await fetch(url);
  return await res.json();
}

// Update UI
function updateUI(data, name) {

  const current = data.current;

  cityName.textContent = name;
  temperature.textContent = current.temperature_2m + "°C";
  feelsLike.textContent = current.apparent_temperature + "°C";
  humidity.textContent = current.relative_humidity_2m + "%";
  wind.textContent = current.wind_speed_10m + " km/h";
  rain.textContent = current.precipitation + " mm";

  description.textContent = "Live weather updated ✔️";
}


// Search city
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  if (!city) {
    alert("Enter a city name");
    return;
  }

  const coords = await getCoordinates(city);
  if (!coords) return;

  const weather = await getWeather(coords.lat, coords.lon);

  updateUI(weather, coords.name);
});
