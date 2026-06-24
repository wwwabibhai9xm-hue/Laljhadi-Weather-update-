window.onload = async function () {

  document.getElementById("description").textContent = "Loading live weather...";

  try {

    const geo = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=Kathmandu&count=1"
    );

    const geoData = await geo.json();

    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature`
    );

    const data = await weather.json();

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

  } catch (err) {

    document.getElementById("description").textContent =
      "Weather API Error";

    alert(err.message);
  }

};
