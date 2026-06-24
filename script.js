const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const dailyForecast = document.getElementById("dailyForecast");

// Search Button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if(city !== ""){
        getWeatherByCity(city);
    }
});

// Enter Key Search
cityInput.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        searchBtn.click();
    }
});

// Get City Coordinates
async function getWeatherByCity(city){

    try{

        const geoUrl =
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        const geoData = await fetch(geoUrl);
        const geoJson = await geoData.json();

        if(!geoJson.results){
            alert("City not found");
            return;
        }

        const place = geoJson.results[0];

        cityName.innerText =
        `${place.name}, ${place.country}`;

        fetchWeather(
            place.latitude,
            place.longitude
        );

    }catch(error){
        console.log(error);
    }
}

// Main Weather API
async function fetchWeather(lat, lon){

    try{

        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

        const response = await fetch(url);

        const data = await response.json();

        // Current Temperature

        temperature.innerText =
        Math.round(data.current.temperature_2m) + "°C";

        description.innerText =
        getWeatherText(
            data.current.weather_code
        );

        // Daily Forecast

        dailyForecast.innerHTML = "";

        data.daily.time.forEach((day,index)=>{

            const max =
            data.daily.temperature_2m_max[index];

            const min =
            data.daily.temperature_2m_min[index];

            const code =
            data.daily.weather_code[index];

            const card =
            document.createElement("div");

            card.className =
            "forecast-card";

            card.innerHTML = `
                <div class="forecast-left">
                    <strong>
                    ${formatDate(day)}
                    </strong>
                    <small>
                    ${getWeatherText(code)}
                    </small>
                </div>

                <div class="forecast-icon">
                    ${getWeatherIcon(code)}
                </div>

                <div class="forecast-temp">
                    ${Math.round(max)}°
                    /
                    ${Math.round(min)}°
                </div>
            `;

            dailyForecast.appendChild(card);

        });

    }catch(error){
        console.log(error);
    }

}

// Format Date

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-US",
        {
            weekday:"short",
            day:"numeric",
            month:"short"
        }
    );

}

// Weather Text

function getWeatherText(code){

    if(code === 0) return "Clear Sky";

    if(code <= 3) return "Partly Cloudy";

    if(code <= 48) return "Cloudy";

    if(code <= 67) return "Rain";

    if(code <= 77) return "Snow";

    if(code <= 99) return "Storm";

    return "Weather";
}

// Weather Icons

function getWeatherIcon(code){

    if(code === 0) return "☀️";

    if(code <= 3) return "⛅";

    if(code <= 48) return "☁️";

    if(code <= 67) return "🌧️";

    if(code <= 77) return "❄️";

    if(code <= 99) return "⛈️";

    return "☀️";
}

// Default City

window.onload = () => {

    getWeatherByCity("Kathmandu");

};
