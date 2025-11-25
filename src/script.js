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
    const rowData = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6914a1322ff148bfbc3124249252311&q=${city}&days=7`); //6 Days Forecast

    let data = await rowData.json();
    console.log(data)
    if (data.error) {
      alert(data.error.message);   // No matching location found
      return;
    }
    searchBox.value = ""; //clear input box
  }
  catch (e) {
    console.log("Err", e)
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