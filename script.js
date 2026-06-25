async function loadWeather() {
  try {
    document.getElementById("description").textContent = "Loading weather...";

    // Kathmandu coordinates
    const lat = 27.7172;
    const lon = 85.3240;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature`
    );

    const data = await response.json();

    document.getElementById("cityName").textContent = "Kathmandu";
    document.getElementById("temperature").textContent =
      data.current.temperature_2m + "°C";

    document.getElementById("feelsLike").textContent =
      data.current.apparent_temperature + "°";

    document.getElementById("humidity").textContent =
      data.current.relative_humidity_2m + "%";

    document.getElementById("wind").textContent =
      data.current.wind_speed_10m + " km/h";

    document.getElementById("description").textContent =
      "Live weather updated ✔";
  } catch (error) {
    document.getElementById("description").textContent =
      "Weather loading failed ❌";

    alert(error.message);
  }
}

loadWeather();
