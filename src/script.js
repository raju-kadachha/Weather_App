//Get DOM Elements
const searchBox = document.getElementById("search");
//Added click event to search button
document.getElementById("searchBtn").addEventListener("click", () => { fetchWeather(searchBox.value) });

document.getElementById("locationBtn").addEventListener("click", async () => {
  //using lat and  lon we are fetching data
  getCurrentCity()
})

//MAIN Function
async function fetchWeather(city) {
  try {
    // Fetching Data from API 
    if (city.trim() === "") return alert("Please write city name");
    const rowData = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6914a1322ff148bfbc3124249252311&q=${city}&days=7`);
    let data = await rowData.json();

    if (data.error) {
      alert(data.error.message);   // e.g., No matching location found
      return;
    }

    renderWeatherCard(data);

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
  const {
    location,
    current
  } = data;
  const html = `
    <div class="max-w-md mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold">${location.name}, ${location.region}</h2>
          <p class="text-sm text-gray-600">Local: ${location.localtime}</p>
        </div>

        <img src="${current.condition.icon}"
             alt="${current.condition.text}"
             class="w-14 h-14" />
      </div>

      <!-- Temperature -->
      <div class="text-center mb-6">
        <p class="text-5xl font-bold text-blue-700">${current.temp_c}°C</p>
        <p class="text-base text-gray-600 mt-1">${current.condition.text}</p>
        <p class="text-sm text-gray-500 mt-1">Feels like ${current.feelslike_c}°C</p>
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
      <div class="mt-4 p-4 bg-gray-100 rounded-xl text-sm space-y-1">
        <p><strong>Dew Point:</strong> ${current.dewpoint_c}°C</p>
        <p><strong>Wind Gust:</strong> ${current.gust_kph} km/h</p>
        <p><strong>UV Index:</strong> ${current.uv}</p>
        <p><strong>Updated:</strong> ${current.last_updated}</p>
      </div>
    </div>
  `;

  document.getElementById("todayWeather").innerHTML = html;
}


