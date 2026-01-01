//Select DOM Elements
const searchBox = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
// Search Button clickk
searchBtn.addEventListener("click", () => {
  fetchWeather(searchBox.value);
});

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  fetchWeather(searchBox.value);
});

// Location Button
locationBtn.addEventListener("click", () => {
  getCurrentCity();
});



// MAIN FUNCTION — Fetch Weather
async function fetchWeather(city) {
  // empty input box
  city = city.trim().toLowerCase();
  if (city === "") {
    notify("Please enter a city name.", "✏️");
    return;
  }
  //check internet connection
  if (!navigator.onLine) {
    notify("You're offline. Check your internet.", "📡");
    return;
  }

  // Disable buttons
  searchBtn.disabled = true;
  locationBtn.disabled = true;

  // fetch data
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=84db22e8d3a34f51a5925909260101&q=${city}&days=7`
    );

    //not able to fetch data
    if (!response.ok) {
      notify("Unable to fetch weather data.", "❌");
      return;
    }

    const data = await response.json();

    //wrong city name
    if (data.error) {
      notify("City not found.", "⚠️");
      return;
    }


    renderWeatherCard(data);
    renderForecastCards(data);
    addRecent(city);
    extremeAlerts(data.current);
    applyWeatherBackground(data.current);
    searchBox.value = "";

  } catch (err) {
    // unexpected errors
    notify("Something went wrong. Please try again.", "❌");
  } finally {
    // Enable Buttons
    searchBtn.disabled = false;
    locationBtn.disabled = false;
  }
}


// Fetch Current Location
async function getCurrentCity() {
  // Get current location
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // Fetch Weather using lat and lon
      fetchWeather(`${lat},${lon}`);
    },

    // Handle location errors
    (err) => {
      notify("Unable to access your location. 📍");
    }
  );
}

// Render Current Weather Card
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

      <!-- Temperature -->
      <div class="text-center mb-6">
        <div class="flex items-center justify-center gap-4 mb-2">
          <p id="temp" class="text-5xl font-bold text-blue-700">
            ${isCelsius ? current.temp_c : toF(current.temp_c)}°${isCelsius ? "C" : "F"}
          </p>

          <button id="toggleTemp"
            class="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium 
            shadow-inner shadow-gray-400/50 hover:bg-gray-300 transition-colors">
            ${isCelsius ? "°F" : "°C"}
          </button>
        </div>

        <p class="text-base text-gray-600 mt-1">${current.condition.text}</p>

        <p id="feelsLike" class="text-sm text-gray-500 mt-1">
          Feels like ${isCelsius ? current.feelslike_c : toF(current.feelslike_c)}°${isCelsius ? "C" : "F"}
        </p>
      </div>

      <!-- Main Stats (unchanged) -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="p-4 bg-blue-100 rounded-xl text-center">
          <p class="text-xl font-bold">${current.humidity}%</p>
          <p class="text-xs text-gray-600">Humidity</p>
        </div>

        <div class="p-4  bg-blue-100 rounded-xl text-center">
          <p class="text-xl font-bold">${current.wind_kph} km/h</p>
          <p class="text-xs text-gray-600">Wind (${current.wind_dir})</p>
        </div>

        <div class="p-4 bg-blue-100 rounded-xl text-center">
          <p class="text-xl font-bold">${current.vis_km} km</p>
          <p class="text-xs text-gray-600">Visibility</p>
        </div>

        <div class="p-4 bg-blue-100 rounded-xl text-center">
          <p class="text-xl font-bold">${current.pressure_mb} mb</p>
          <p class="text-xs text-gray-600">Pressure</p>
        </div>
      </div>

      <!-- Extra Info with dew point updated -->
      <div class="mt-4 p-4 bg-gray-100 rounded-xl text-sm space-y-1 
        shadow-inner shadow-gray-300/70 border border-gray-200">

        <p><strong>Dew Point:</strong> 
          ${isCelsius ? current.dewpoint_c : toF(current.dewpoint_c)}°${isCelsius ? "C" : "F"}
        </p>

        <p><strong>Wind Gust:</strong> ${current.gust_kph} km/h</p>
        <p><strong>UV Index:</strong> ${current.uv}</p>
        <p><strong>Updated:</strong> ${current.last_updated}</p>
      </div>
    </div>
  `;

  document.getElementById("todayWeather").innerHTML = html;

  // Toggle button logic
  const toggleBtn = document.getElementById("toggleTemp");

  toggleBtn.onclick = () => {
    isCelsius = !isCelsius; // Flip unit mode

    renderWeatherCard(data);     // Rerender TODAY values
    renderForecastCards(data);   // Rerender FORECAST
  };
}

//true = C, false = F
let isCelsius = true;
// utility clas Convert Celsius to Fahrenheit
function toF(c) {
  return (c * 9 / 5 + 32).toFixed(1);
}
// future forecast cards
function renderForecastCards(data) {
  //Forecast data
  document.getElementById("forecastHeading").classList.remove("hidden");
  const forecast = data.forecast.forecastday;
  const container = document.getElementById("forecastSection");
  container.innerHTML = "";

  // Loop through each upcoming day in the forecast - max 6
  for (let i = 1; i < Math.min(forecast.length, 7); i++) {
    const day = forecast[i];

    // Temperature convert 
    const max = isCelsius ? day.day.maxtemp_c : toF(day.day.maxtemp_c);
    const min = isCelsius ? day.day.mintemp_c : toF(day.day.mintemp_c);
    const unit = isCelsius ? "C" : "F";

    container.innerHTML += `
      <div class="bg-white rounded-xl shadow p-4 text-center border border-gray-200
        transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400">

        <h3 class="text-lg font-semibold mb-1">${day.date}</h3>
        <img src="${day.day.condition.icon}" class="w-14 mx-auto" />
        <p class="text-gray-700 mt-1">${day.day.condition.text}</p>

        <!-- Temperature -->
        <div class="mt-3 text-base font-bold flex justify-center gap-4">
          <span class="flex items-center gap-1 text-red-500">
            <img src="img/high-temperature.png" class="w-4 h-4" />${max}°${unit}
          </span>
          <span class="flex items-center gap-1 text-blue-600">
            <img src="img/low-temperature.png" class="w-4 h-4" />${min}°${unit}
          </span>
        </div>

        <!-- Wind -->
        <div class="mt-2 text-gray-700 flex justify-center gap-2 items-center">
          <img src="img/wind.png" class="w-4 h-4" /> <span class="font-medium">${day.day.maxwind_kph} km/h</span>
        </div>

        <!-- Humidity -->
        <div class="mt-1 text-gray-700 flex justify-center gap-2 items-center">
          <img src="img/humidity.png" class="w-4 h-4" /> <span class="font-medium">${day.day.avghumidity}%</span>
        </div>

      </div>
    `;
  }
}

// Recent Cities Logic
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

renderRecent();

// Toggle the visibility of the recent cities list 
document.getElementById("recentToggle").addEventListener("click", () => {
  document.getElementById("recentList").classList.toggle("hidden");
});

function addRecent(city) {
  if (!city || /^\d+(\.\d+)?,\d+(\.\d+)?$/.test(city)) return;  //check for lat and lon
  //if city is not in List add it to list
  if (!recentCities.includes(city)) recentCities.unshift(city);

  //Set LocalStorage
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecent(); //render dropdown
}

function renderRecent() {
  // Container for recent searches
  const recentBox = document.getElementById("recentBox");
  const list = document.getElementById("recentList");

  // Hide if empty
  if (!recentCities.length) return recentBox.classList.add("hidden");
  recentBox.classList.remove("hidden"); // Show container

  // Clear previous items
  list.innerHTML = "";
  recentCities.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = c;
    li.className = "p-2 hover:bg-blue-100 cursor-pointer";
    li.onclick = () => {
      fetchWeather(c);  // Fetch weather when clicked
      list.classList.add("hidden"); // Close list
    };
    list.appendChild(li); // Add to list
  });
}

// Custom Notification
function notify(message, icon = "") {
  const note = document.createElement("div");
  note.className = `
    fixed inset-0 flex items-center justify-center
    bg-black/40 backdrop-blur-sm z-20 animate-fadeIn
  `;
  const box = document.createElement("div");
  box.className = `
    bg-white/90 backdrop-blur-xl text-gray-900
    font-medium px-6 py-5 rounded-2xl shadow-xl border border-gray-200
    w-[90%] max-w-sm text-center flex flex-col gap-4
  `;
  //Notification Text
  const msg = document.createElement("div");
  msg.className = "text-lg font-semibold";
  msg.textContent = `${icon} ${message}`; //icon + text

  //Notification Button
  const btn = document.createElement("button");
  btn.textContent = "OK";
  btn.className = `
    w-1/4 text-white bg-gray-500 px-3 py-1.5 rounded-md
    hover:bg-gray-700 active:scale-95 transition-all
    text-sm shadow-sm self-end
  `;

  //Add Eventlistener for Ok
  btn.onclick = () => {
    document.querySelector("main").classList.remove("blur-[1px]");
    note.remove();
  };

  //Add to DOM
  box.appendChild(msg);
  box.appendChild(btn);
  note.appendChild(box);
  document.body.appendChild(note);

  //Blur Background
  document.querySelector("main").classList.add("blur-[1px]");
}

function extremeAlerts(current) {

  // Heat Alert
  if (current.temp_c >= 40) {
    notify(`⚠️ Heat Alert! Temperature is ${current.temp_c}°C`, "🔥");
  }

  // Cold Alert
  if (current.temp_c <= 0) {
    notify(`❄️ Cold Alert! Temperature is ${current.temp_c}°C`, "🧊");
  }

  // High Wind Alert
  if (current.wind_kph >= 50) {
    notify(`🌬️ Wind Alert! Speed is ${current.wind_kph} km/h`, "💨");
  }

  // Heavy Rain Alert
  if (current.precip_mm >= 20) {
    notify(`🌧️ Heavy Rain Alert! Precipitation is ${current.precip_mm} mm`, "☔");
  }

  // High UV Index Alert
  if (current.uv >= 8) {
    notify(`☀️ UV Alert! UV index is ${current.uv}`, "🕶️");
  }

  // Freezing Wind Alert
  if (current.temp_c <= 0 && current.wind_kph >= 20) {
    notify(`🧊 Freezing Wind! Temp: ${current.temp_c}°C, Wind: ${current.wind_kph} km/h`, "❄️");
  }

  // High Humidity Alert
  if (current.humidity >= 90) {
    notify(`💧 High Humidity! ${current.humidity}%`, "💦");
  }
}

function applyWeatherBackground(current) {
  const body = document.body;
  const temp = current.temp_c;
  const condition = current.condition.text.toLowerCase();

  let bgColor = "#f3f4f6"; // default color
  //include check if string has that word or not
  if (condition.includes("rain") || condition.includes("drizzle")) {
    bgColor = temp <= 0 ? "#60a5fa" : "#bfdbfe";
  } else if (condition.includes("snow")) {
    bgColor = "#e0f2fe";
  } else if (condition.includes("cloud")) {
    bgColor = temp <= 0 ? "#c7d2fe" : "#dbeafe";
  } else if (condition.includes("mist") || condition.includes("fog")) {
    bgColor = "#e5e7eb";
  } else if (condition.includes("sun") || condition.includes("clear")) {
    bgColor = temp >= 35 ? "#fde68a" : "#fef3c7";
  }

  body.style.background = bgColor;
}
