const apiKey = "63844c524c7c0c62291cc121e42e13a6"; // Your OpenWeather API key here
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const errorBox = document.getElementById("error");
const weatherBox = document.getElementById("weather-info");

const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsLikeEl = document.getElementById("feels-like");

async function fetchWeather(city) {
    // Clear old error
    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    if (!city || city.trim() === "") {
        showError("Please enter a city name.");
        return;
    }

    try {
        const url = `${apiUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showError("City not found. Try another name.");
            } else {
                showError("Failed to fetch weather. Try again later.");
            }
            weatherBox.classList.add("hidden");
            return;
        }

        const data = await response.json();
        renderWeather(data);
    } catch (error) {
        console.error(error);
        showError("Network error. Check your connection.");
        weatherBox.classList.add("hidden");
    }
}

function renderWeather(data) {
    // Update UI with data
    const city = `${data.name}, ${data.sys.country}`;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const humidity = data.main.humidity; // %
    const windSpeed = data.wind.speed; // m/s
    const feelsLike = Math.round(data.main.feels_like);

    cityNameEl.textContent = city;
    tempEl.textContent = temp;
    descEl.textContent = desc;
    humidityEl.textContent = `${humidity}%`;
    windEl.textContent = `${windSpeed} m/s`;
    feelsLikeEl.textContent = `${feelsLike}°C`;

    weatherBox.classList.remove("hidden");
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

// Event: button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    fetchWeather(city);
});

// Event: Enter key in input
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value;
        fetchWeather(city);
    }
});
