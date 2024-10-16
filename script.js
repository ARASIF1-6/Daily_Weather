const apiKey = '88bd4d944eeb4645a4c85049241610';
const weatherInfo = document.getElementById('weatherInfo');
const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const sortOption = document.getElementById('sort');
const errorDiv = document.getElementById('error');

// Function to fetch weather data
async function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
}

// Function to display weather data
function displayWeather(data) {
    errorDiv.textContent = '';
    const forecast = data.forecast.forecastday;
    let weatherHtml = `<h2>${data.location.name}, ${data.location.country}</h2>
                       <p>Current Temp: ${data.current.temp_c}°C</p>
                       <p>Condition: ${data.current.condition.text}</p>
                       <h3>3-Day Forecast:</h3>
                       <div id="forecastContainer">`;

    forecast.forEach(day => {
        weatherHtml += `<div>
                            <h4>${new Date(day.date).toDateString()}</h4>
                            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
                            <p>Min Temp: ${day.day.mintemp_c}°C</p>
                            <p>Humidity: ${day.day.avghumidity}%</p>
                            <p>Wind: ${day.day.maxwind_kph} kph</p>
                        </div>`;
    });

    weatherHtml += `</div>`;
    weatherInfo.innerHTML = weatherHtml;
}

// Function to display error
function displayError(message) {
    weatherInfo.innerHTML = '';
    errorDiv.textContent = message;
}

// Search functionality
searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    } else {
        displayError('Please enter a location name');
    }
});

// Sorting options functionality
sortOption.addEventListener('change', () => {
    const forecastContainer = document.getElementById('forecastContainer');
    let sortedDays = [...forecastContainer.children];
    
    if (sortOption.value === 'temp') {
        sortedDays.sort((a, b) => parseFloat(b.querySelector('p:nth-child(2)').textContent.split(': ')[1]) - parseFloat(a.querySelector('p:nth-child(2)').textContent.split(': ')[1]));
    } else if (sortOption.value === 'humidity') {
        sortedDays.sort((a, b) => parseFloat(b.querySelector('p:nth-child(4)').textContent.split(': ')[1]) - parseFloat(a.querySelector('p:nth-child(4)').textContent.split(': ')[1]));
    } else if (sortOption.value === 'wind') {
        sortedDays.sort((a, b) => parseFloat(b.querySelector('p:nth-child(5)').textContent.split(': ')[1]) - parseFloat(a.querySelector('p:nth-child(5)').textContent.split(': ')[1]));
    }
    
    forecastContainer.innerHTML = '';
    sortedDays.forEach(day => forecastContainer.appendChild(day));
});