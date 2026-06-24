const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");

const hourlyForecast = document.getElementById("hourlyForecast");
const dailyForecast = document.getElementById("dailyForecast");

/* SEARCH */

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        getWeatherByCity(city);
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

/* GET CITY */

async function getWeatherByCity(city) {

    try {

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const place = geoData.results[0];

        cityName.innerText =
            `${place.name}, ${place.country}`;

        fetchWeather(
            place.latitude,
            place.longitude
        );

    } catch (error) {
        console.log(error);
    }
}

/* WEATHER */

async function fetchWeather(lat, lon) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

        const response = await fetch(url);
        const data = await response.json();

        /* CURRENT */

        temperature.innerText =
            Math.round(data.current.temperature_2m) + "°C";

        description.innerText =
            getWeatherText(data.current.weather_code);

        weatherIcon.innerText =
            getWeatherIcon(data.current.weather_code);

        feelsLike.innerText =
            Math.round(data.current.apparent_temperature) + "°";

        humidity.innerText =
            data.current.relative_humidity_2m + "%";

        wind.innerText =
            Math.round(data.current.wind_speed_10m) + " km/h";

        rain.innerText =
            Math.round(data.daily.temperature_2m_max[0]) + "°";

        /* HOURLY */

        hourlyForecast.innerHTML = "";

        for (let i = 0; i < 12; i++) {

            const hour =
                data.hourly.time[i].split("T")[1];

            const temp =
                Math.round(
                    data.hourly.temperature_2m[i]
                );

            const code =
                data.hourly.weather_code[i];

            hourlyForecast.innerHTML += `
            <div class="hour-card">
                <div>${hour}</div>
                <div class="icon">
                    ${getWeatherIcon(code)}
                </div>
                <div>${temp}°</div>
            </div>
            `;
        }

        /* DAILY */

        dailyForecast.innerHTML = "";

        data.daily.time.forEach((day, index) => {

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
                        ${getWeatherText(
                            data.daily.weather_code[index]
                        )}
                    </small>
                </div>

                <div class="forecast-icon">
                    ${getWeatherIcon(
                        data.daily.weather_code[index]
                    )}
                </div>

                <div class="forecast-temp">
                    ${Math.round(
                        data.daily.temperature_2m_max[index]
                    )}°
                    /
                    ${Math.round(
                        data.daily.temperature_2m_min[index]
                    )}°
                </div>
            `;

            dailyForecast.appendChild(card);

        });

    } catch (error) {

        console.log(error);

    }
}

/* DATE FORMAT */

function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );
}

/* WEATHER TEXT */

function getWeatherText(code) {

    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Cloudy";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 99) return "Storm";

    return "Weather";
}

/* WEATHER ICON */

function getWeatherIcon(code) {

    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 99) return "⛈️";

    return "☀️";
}


/* DEFAULT CITY */

window.onload = () => {

    getWeatherByCity("Kathmandu");

};
const pages = {
    0: document.getElementById("todayPage"),
    1: document.getElementById("hourlyPage"),
    2: document.getElementById("dailyPage"),
    3: document.getElementById("radarPage"),
    4: document.getElementById("climatePage")
};

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((btn,index)=>{

    btn.addEventListener("click",()=>{

        navItems.forEach(item=>{
            item.classList.remove("active");
        });

        btn.classList.add("active");

        Object.values(pages).forEach(page=>{
            page.style.display="none";
        });

        pages[index].style.display="block";

    });

});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
    item.addEventListener("click", () => {

        navItems.forEach(btn =>
            btn.classList.remove("active")
        );

        item.classList.add("active");

        alert(item.innerText + " page coming soon!");
    });
});
