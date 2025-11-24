//Get DOM Elements
const searchBox = document.getElementById("search")
//Added click event to search button
document.getElementById("searchBtn").addEventListener("click", () => { fetchWeather(searchBox.value) })

//MAIN Function
async function fetchWeather(city) {
    try {
        // Fetching Data from API 
        if (city === "") return alert("Please write city name");
        const rowData = await fetch(`https://api.weatherapi.com/v1/current.json?key=6914a1322ff148bfbc3124249252311&q=${city}`);
        let data = await rowData.json();
        searchBox.value = "";
    }
    catch (e) {
        console.log("Not Able to get Data.\nPlease, check your Internet.")
    }
}