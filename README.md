# Weather Dashboard Web App

This project is a **Weather Dashboard** web application that allows users to check the current weather, view a 5-day forecast, visualize weather trends in charts, and interact with a chatbot for basic weather queries. The app uses the **OpenWeather API** to fetch real-time weather data for cities entered by the user or based on their geolocation.

## Demo

You can see a live demo of the Weather Dashboard by clicking [here](https://weather-app-eight-steel-61.vercel.app).

## Features

- **Weather Data by City or Location**: Users can search for weather by city name or allow geolocation to fetch data automatically.
- **Unit Toggle**: The temperature can be toggled between Celsius (°C) and Fahrenheit (°F).
- **Weather Forecast**: Displays a 5-day forecast with filters to sort or show specific weather conditions (rainy days, highest temperature, etc.).
- **Interactive Charts**: Bar, line, and doughnut charts to visualize temperature trends and weather conditions using **Chart.js**.
- **Chatbot Integration**: A Dialogflow-powered chatbot to answer common weather questions, like highest or lowest temperatures.
- **Responsive Design**: Built with **Tailwind CSS**, the UI is responsive and adapts to various screen sizes.
- **AOS Animations**: Smooth animations when loading different sections using **AOS.js**.

## Technologies Used

- **HTML5/CSS3**: For structure and layout.
- **Tailwind CSS**: For styling and responsiveness.
- **JavaScript**: For client-side logic and interactivity.
- **OpenWeather API**: For real-time weather and forecast data.
- **Chart.js**: For generating weather trend charts.
- **Dialogflow**: A chatbot to answer basic weather questions.
- **FontAwesome**: For icons used in the interface.
- **AOS.js**: For scroll animations.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/WeatherApp.git
```

## OpenWeather API Key

This project requires an API key from **OpenWeather**. If you do not have one, you can create a free account on **OpenWeather** and generate an API key.

Once you have your API key, replace the placeholder in **script.js**:
```bash
const apiKey = 'your-openweather-api-key-here';

```

## Geolocation

The app automatically fetches weather data based on the user's current location if geolocation permissions are granted.

## Dialogflow Chatbot


The chatbot is powered by Dialogflow. If you want to modify the chatbot responses, you can create your own Dialogflow agent and use its agent ID in the df-messenger component in the HTML file.

```bash
<df-messenger
  intent="Welcome"
  chat-title="weatherbot"
  agent-id="your-dialogflow-agent-id"
  language-code="en">
</df-messenger>


```

## Forecast Table
A table showing the 5-day weather forecast with filters for sorting and showing specific conditions (e.g., rainy days or highest temperature).



### Notes for Usage:
1. Replace `your-username` in the repository clone URL with your actual GitHub username.
2. Replace `your-openweather-api-key-here` in the code snippet with your OpenWeather API key.
3. Replace `your-dialogflow-agent-id` in the Dialogflow section with your own Dialogflow agent ID.


