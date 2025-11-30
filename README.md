# Weather_App

Github Link - https://github.com/raju-kadachha/Weather_App

A simple and clean weather dashboard that shows current weather, weekly forecasts, recent searches, location-based weather, and interactive UI features. The project is built using HTML, TailwindCSS (CLI), and vanilla JavaScript.

## **Setup Instructions**

- This project uses **TailwindCSS (CLI version)**.  
  **https://tailwindcss.com/docs/installation/tailwind-cli**
  Make sure Tailwind is installed, and generate the CSS file using:

WEATHER_APP > npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch

## **Code Snippets**

fetchWeather(city) → Fetches weather data from the API for the given city.
renderWeatherCard(data) → Updates the main weather card (today’s weather) with API data.
renderForecastCards(data) → Displays 7-day forecast cards.
addRecent(city) → Adds searched city to the recent searches dropdown and LocalStorage.
extremeAlerts() → Shows alerts when temperature crosses extreme thresholds.
toggleTempUnit() → Switches temperatures between Celsius and Fahrenheit.
getCurrentCity() / getLocationWeather() → Retrieves weather for user’s current location.

## **Technologies Used**

HTML5 → For page structure and semantic layout.
TailwindCSS (CLI) → For styling, spacing, animations, and responsive design.
Vanilla JavaScript → Handles API calls, UI updates, toggles, alerts, and event logic.
WeatherAPI → Provides real-time weather and 7-day forecast data.
LocalStorage → Saves recent city searches for persistence across page reloads.

## **Notes**

After changing screen sizes, refresh the page to re-fetch and display data correctly.
If the Location button stops responding, restart Live Server to reset permissions.
TailwindCSS must be compiled before opening the page; otherwise, the UI will look broken.
Always use Live Server to run the project; direct file opening will not work properly.

## **Folder Structure**

WEATHER_APP/
├─ index.html
├─ package.json
├─ package-lock.json
├─ .gitignore
├─ img/ # icons/images
└─ src/
├─ input.css
├─ output.css
└─ script.js
