async function fetchWeather(city) {
    try {


        const url = `https://api.weatherapi.com/v1/current.json?key=6914a1322ff148bfbc3124249252311&q=${city}`;

        const rowData = await fetch(url);
        let data = await rowData.json();
    }
    catch (e) {
        console.log("Not Able to get Data.\nPlease, check your Internet.")
    }
}
fetchWeather("Ahmedabad");