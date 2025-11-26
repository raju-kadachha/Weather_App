//Get DOM Elements
const searchBox = document.getElementById("search");
//Added click event to search button
document.getElementById("searchBtn").addEventListener("click", () => { fetchWeather(searchBox.value) });

document.getElementById("locationBtn").addEventListener("click", async () => {
  //using lat and  lon we are fetching data
  getCurrentCity()
});

//MAIN Function
async function fetchWeather(city) {
  try {
    // Fetching Data from API 
    if (city.trim() === "") return alert("Please write city name");
    const rowData = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6914a1322ff148bfbc3124249252311&q=${city}&days=7`);
    let data = await rowData.json();

    if (data.error) {
      alert(data.error.message);   // No matching location found
      return null;
    }
    renderWeatherCard(data);
    renderForecastCards(data)
    addRecent(searchBox.value.trim());
    searchBox.value = "";
  }
  catch (e) {
    console.log("Not Able to get Data.\nPlease, check your Internet.")
  }
}

//Fetch Current Location City Name
async function getCurrentCity() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        resolve(await fetchWeather(`${lat},${lon}`));
      }
      catch (error) {
        reject("Error fetching city name");
      }
    },
      () => reject("Location permission denied"));
  });
}

function renderWeatherCard(data) {
  const { location, current } = data;
  const html = `
    <div class="max-w-md mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200 
            animate-[fadeInUp_0.3s_ease-out]">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold">${location.name}, ${location.region}</h2>
          <p class="text-sm text-gray-600">Local: ${location.localtime}</p>
        </div>
        <img src="${current.condition.icon}" alt="${current.condition.text}" class="w-14 h-14" />
      </div>

      <!-- Temperature with toggle -->
      <div class="text-center mb-6">
        <div class="flex items-center justify-center gap-4 mb-2">
          <p id="temp" class="text-5xl font-bold text-blue-700">${current.temp_c}°C</p>
          
          <!-- Toggle Button -->
          <button id="toggleTemp"
            class="px-4 py-2 pr-5 bg-gray-200 rounded-full text-sm font-medium shadow-inner shadow-gray-400/50 hover:bg-gray-300 transition-colors">
            °F
          </button>
        </div>
        <p class="text-base text-gray-600 mt-1">${current.condition.text}</p>
        <p id="feelsLike" class="text-sm text-gray-500 mt-1">Feels like ${current.feelslike_c}°C</p>
      </div>

      <!-- Main Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="p-4 bg-blue-50 rounded-xl text-center">
          <p class="text-xl font-bold">${current.humidity}%</p>
          <p class="text-xs text-gray-600">Humidity</p>
        </div>

        <div class="p-4 bg-blue-50 rounded-xl text-center">
          <p class="text-xl font-bold">${current.wind_kph} km/h</p>
          <p class="text-xs text-gray-600">Wind (${current.wind_dir})</p>
        </div>

        <div class="p-4 bg-blue-50 rounded-xl text-center">
          <p class="text-xl font-bold">${current.vis_km} km</p>
          <p class="text-xs text-gray-600">Visibility</p>
        </div>

        <div class="p-4 bg-blue-50 rounded-xl text-center">
          <p class="text-xl font-bold">${current.pressure_mb} mb</p>
          <p class="text-xs text-gray-600">Pressure</p>
        </div>
      </div>

      <!-- Extra Info -->
      <div class="mt-4 p-4 bg-gray-100 rounded-xl text-sm space-y-1 shadow-inner shadow-gray-300/70 border border-gray-200">
        <p><strong>Dew Point:</strong> ${current.dewpoint_c}°C</p>
        <p><strong>Wind Gust:</strong> ${current.gust_kph} km/h</p>
        <p><strong>UV Index:</strong> ${current.uv}</p>
        <p><strong>Updated:</strong> ${current.last_updated}</p>
      </div>
    </div>
  `;

  document.getElementById("todayWeather").innerHTML = html;
  const toggleBtn = document.getElementById("toggleTemp");
  const tempEl = document.getElementById("temp");
  const feelsEl = document.getElementById("feelsLike");

  let isCelsius = true;

  toggleBtn.addEventListener("click", () => {
    isCelsius = !isCelsius; // flip unit

    tempEl.textContent = isCelsius
      ? `${current.temp_c}°C`
      : `${(current.temp_c * 9 / 5 + 32).toFixed(1)}°F`;

    feelsEl.textContent = isCelsius
      ? `Feels like ${current.feelslike_c}°C`
      : `Feels like ${(current.feelslike_c * 9 / 5 + 32).toFixed(1)}°F`;

    toggleBtn.textContent = isCelsius ? "°F" : "°C";
  });
}

function renderForecastCards(data) {
  const forecast = data.forecast.forecastday;

  const container = document.getElementById("forecastSection");
  container.innerHTML = "";

  for (let i = 1; i < forecast.length; i++) {
    const day = forecast[i];

    const card = `
      <div class="bg-white rounded-xl shadow p-4 text-center border border-gray-200
     transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400">
        <h3 class="text-lg font-semibold mb-1">${day.date}</h3>
        <img src="${day.day.condition.icon}" class="w-14 mx-auto" />
        <p class="text-gray-700 mt-1">${day.day.condition.text}</p>

        <div class="mt-2 text-base font-bold">
          <span class="text-red-500 mr-2">↑ ${day.day.maxtemp_c}°C</span>
          <span class="text-blue-600">↓ ${day.day.mintemp_c}°C</span>
        </div>
      </div>
    `;
    container.innerHTML += card;
  }
}

let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Render on page load
renderRecent();

// Toggle dropdown visibility
document.getElementById("recentToggle").addEventListener("click", () => {
  document.getElementById("recentList").classList.toggle("hidden");
});

// Add city to dropdown
function addRecent(city) {
  if (city === "") return;

  if (!recentCities.includes(city)) {
    recentCities.unshift(city);
  }

  // Save to localStorage
  localStorage.setItem("recentCities", JSON.stringify(recentCities));

  renderRecent();
}

// Render dropdown
function renderRecent() {
  const recentBox = document.getElementById("recentBox");
  const list = document.getElementById("recentList");

  if (recentCities.length === 0) {
    recentBox.classList.add("hidden");
    return;
  }

  // Show the box
  recentBox.classList.remove("hidden");

  list.innerHTML = "";

  recentCities.forEach(c => {
    let li = document.createElement("li");
    li.textContent = c;
    li.className = "p-2 hover:bg-blue-100 cursor-pointer";

    li.onclick = () => {
      fetchWeather(c);
      list.classList.add("hidden");
    };

    list.appendChild(li);
  });
}
