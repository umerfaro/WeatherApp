// Replace with your OpenWeather API key
const apiKey = '56f5b7c8b9669a988a6b789c6f518a89';

// Global variables
let forecastData = [];
let currentWeatherData = null; // Store current weather data
let currentPage = 1;
const entriesPerPage = 10;
let selectedUnit = 'C'; // Default to Celsius

let currentFilter = null; // 'rain', 'highestTemp'
let currentSort = null;   // 'asc', 'desc'


// Event listeners for filter buttons
document.getElementById('sortAscBtn').addEventListener('click', () => {
    currentSort = 'asc';
    currentFilter = null; // Reset filter
    currentPage = 1; // Reset pagination
    updateForecastTable();
  });
  
  document.getElementById('sortDescBtn').addEventListener('click', () => {
    currentSort = 'desc';
    currentFilter = null; // Reset filter
    currentPage = 1;
    updateForecastTable();
  });
  
  document.getElementById('filterRainBtn').addEventListener('click', () => {
    currentFilter = 'rain';
    currentSort = null; // Reset sort
    currentPage = 1;
    updateForecastTable();
  });
  
  document.getElementById('highestTempBtn').addEventListener('click', () => {
    currentFilter = 'highestTemp';
    currentSort = null; // Reset sort
    currentPage = 1;
    updateForecastTable();
  });
  
  document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    currentFilter = null;
    currentSort = null;
    currentPage = 1;
    updateForecastTable();
  });
  


// Show and hide loading spinner functions
function showLoadingSpinner() {
  document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoadingSpinner() {
  document.getElementById('loadingSpinner').classList.add('hidden');
}

// Event listener for Get Weather button
document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const cityName = document.getElementById('cityInput').value.trim();
  if (cityName) {
    getWeatherData(cityName);
  } else {
    alert('Please enter a city name.');
  }
});

// Event listener for Unit Toggle
document.getElementById('unitToggle').addEventListener('change', () => {
  selectedUnit = document.getElementById('unitToggle').value;

  // Update the displayed data with the new unit
  if (currentWeatherData) {
    updateWeatherWidget(currentWeatherData);
  }
  updateForecastTable();
  updateCharts(forecastData);
});

// On page load, attempt to get user's location
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherDataByCoords(lat, lon);
      },
      error => {
        console.log('Geolocation not available or permission denied.', error);
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});

// Fetch weather data by city name
async function getWeatherData(city) {
  try {
    showLoadingSpinner();

    // Fetch current weather data
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const currentWeatherResponse = await fetch(currentWeatherURL);
    if (!currentWeatherResponse.ok) throw new Error('City not found');
    currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast data
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastURL);
    if (!forecastResponse.ok) throw new Error('Forecast data not available');
    const forecastJSON = await forecastResponse.json();
    forecastData = forecastJSON.list;

    // Update UI components
    updateWeatherWidget(currentWeatherData);
    updateCharts(forecastData);
    updateForecastTable();
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoadingSpinner();
  }
}

// Fetch weather data by geographical coordinates
async function getWeatherDataByCoords(lat, lon) {
  try {
    showLoadingSpinner();

    // Fetch current weather data
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const currentWeatherResponse = await fetch(currentWeatherURL);
    if (!currentWeatherResponse.ok) throw new Error('Location not found');
    currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast data
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastURL);
    if (!forecastResponse.ok) throw new Error('Forecast data not available');
    const forecastJSON = await forecastResponse.json();
    forecastData = forecastJSON.list;

    // Update UI components
    updateWeatherWidget(currentWeatherData);
    updateCharts(forecastData);
    updateForecastTable();

    // Update city input field with the city name
    document.getElementById('cityInput').value = currentWeatherData.name;
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoadingSpinner();
  }
}

// Helper functions for temperature conversion
function celsiusToFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}

function convertTemperature(temp) {
  if (selectedUnit === 'F') {
    return celsiusToFahrenheit(temp);
  } else {
    return temp;
  }
}

function updateWeatherWidget(data) {
  const widget = document.getElementById('weatherWidget');
  const weatherCondition = data.weather[0].main.toLowerCase();

  // Change background image based on weather condition
  let backgroundImage = 'default.jpg'; // Default background image

  if (weatherCondition.includes('cloud')) {
    backgroundImage = 'cloudy.jpg';
  } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
    backgroundImage = 'rainy.jpg';
  } else if (weatherCondition.includes('clear')) {
    backgroundImage = 'clear.jpg';
  } else if (weatherCondition.includes('snow')) {
    backgroundImage = 'snowy.jpg';
  } else if (weatherCondition.includes('thunderstorm')) {
    backgroundImage = 'thunderstorm.jpg';
  } else if (weatherCondition.includes('mist') || weatherCondition.includes('fog')) {
    backgroundImage = 'mist.jpg';
  }

  let temperature = data.main.temp;
  temperature = convertTemperature(temperature);

  widget.style.backgroundImage = `url('${backgroundImage}')`;

  widget.innerHTML = `
    <h2 class="text-4xl font-bold mb-2">${data.name}, ${data.sys.country}</h2>
    <div class="flex items-center">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
      <p class="text-6xl font-bold">${Math.round(temperature)}&deg;${selectedUnit}</p>
    </div>
    <p class="text-xl capitalize">${data.weather[0].description}</p>
    <p class="mt-4"><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
    <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function updateCharts(data) {
    // Prepare data for charts
    const dates = [];
    const temps = [];
    const weatherConditions = {};
  
    data.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dates.includes(date)) {
        dates.push(date);
  
        // Convert temperature based on selected unit
        let temperature = entry.main.temp;
        temperature = convertTemperature(temperature);
        temps.push(temperature);
  
        const condition = entry.weather[0].main;
        weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
      }
    });
  
    // Remove existing charts if they exist
    if (window.barChartInstance) window.barChartInstance.destroy();
    if (window.doughnutChartInstance) window.doughnutChartInstance.destroy();
    if (window.lineChartInstance) window.lineChartInstance.destroy();
  
    // Vertical Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    window.barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: `Temperature (${selectedUnit === 'C' ? '°C' : '°F'})`,
          data: temps,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      },
      options: {
        animation: {
          delay: 500,
          duration: 2000
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  
    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    window.lineChartInstance = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: `Temperature (${selectedUnit === 'C' ? '°C' : '°F'})`,
          data: temps,
          borderColor: 'rgba(255,99,132,1)',
          fill: false
        }]
      },
      options: {
        animation: {
          duration: 2000,
          easing: 'easeInBounce',
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  
    // Doughnut Chart
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    window.doughnutChartInstance = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
        labels: Object.keys(weatherConditions),
        datasets: [{
        data: Object.values(weatherConditions),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726']
        }]
    },
    options: {
        animation: {
        delay: 500,
        duration: 2000
        },
        responsive: true,
        plugins: {
        legend: {
            position: 'bottom'
        }
        }
    }
    });
  }
  




  function updateForecastTable() {
    const table = document.getElementById('forecastTable');
  
    // Clone the forecast data to avoid mutating the original array
    let displayData = forecastData.slice();
  
    // Apply filters
    if (currentFilter === 'rain') {
      displayData = displayData.filter(entry => {
        return entry.weather[0].description.toLowerCase().includes('rain');
      });
    } else if (currentFilter === 'highestTemp') {
      // Find the entry with the highest temperature
      const highestTempEntry = displayData.reduce((maxEntry, currentEntry) => {
        return currentEntry.main.temp > maxEntry.main.temp ? currentEntry : maxEntry;
      }, displayData[0]);
      displayData = [highestTempEntry]; // Display only the highest temperature entry
    }
  
    // Apply sorting
    if (currentSort === 'asc') {
      displayData.sort((a, b) => a.main.temp - b.main.temp);
    } else if (currentSort === 'desc') {
      displayData.sort((a, b) => b.main.temp - a.main.temp);
    }
  
    const totalPages = Math.ceil(displayData.length / entriesPerPage);
  
    // Pagination logic
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedData = displayData.slice(startIndex, endIndex);
  
    // Generate table HTML
    let tableHTML = `
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2 text-left">Date</th>
          <th class="px-4 py-2 text-left">Day</th>
          <th class="px-4 py-2 text-left">Time</th>
          <th class="px-4 py-2 text-left">Temp (${selectedUnit === 'C' ? '°C' : '°F'})</th>
          <th class="px-4 py-2 text-left">Weather</th>
        </tr>
      </thead>
      <tbody>
    `;
  
    paginatedData.forEach(entry => {
      const [dateStr, time] = entry.dt_txt.split(' ');
      const dateObj = new Date(entry.dt_txt);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = daysOfWeek[dateObj.getDay()];
  
      let temperature = entry.main.temp;
      temperature = convertTemperature(temperature);
  
      tableHTML += `
        <tr class="border-b">
          <td class="px-4 py-2">${dateStr}</td>
          <td class="px-4 py-2">${dayOfWeek}</td>
          <td class="px-4 py-2">${time}</td>
          <td class="px-4 py-2">${Math.round(temperature)}</td>
          <td class="px-4 py-2 capitalize">${entry.weather[0].description}</td>
        </tr>
      `;
    });
  
    tableHTML += '</tbody>';
    table.innerHTML = tableHTML;
  
    // Update pagination controls
    updatePaginationControls(totalPages);
  }
  
    

  function updatePaginationControls(totalPages) {
    const paginationDiv = document.getElementById('paginationControls');
    paginationDiv.innerHTML = '';
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.innerText = i;
      btn.className = `mx-1 px-3 py-1 rounded ${
        i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
      }`;
      btn.addEventListener('click', () => {
        currentPage = i;
        updateForecastTable();
      });
      paginationDiv.appendChild(btn);
    }
  }
  

// Event listener for df-user-input-entered
// // Event listener for df-user-input-entered
// window.addEventListener('df-user-input-entered', function (event) {
//     const message = event.detail.input;
//     const lowercaseMessage = message.toLowerCase();
  
//     // Check if the message is asking about temperatures
//     if (
//       lowercaseMessage.includes('highest temperature') ||
//       lowercaseMessage.includes('lowest temperature') ||
//       lowercaseMessage.includes('average temperature') || lowercaseMessage.includes('current temperature') 
//     ) {
//       // Prevent the message from being sent to Dialogflow
//       event.preventDefault();
//       event.stopImmediatePropagation();
  
//       if (forecastData.length > 0 || currentWeatherData) {
//         let responseText = '';

//         if (lowercaseMessage.includes('current temperature')) {
//           if (currentWeatherData) {
//             let temperature = currentWeatherData.main.temp;
//             temperature = convertTemperature(temperature).toFixed(1);
//             const cityName = currentWeatherData.name;
//             const weatherDescription = currentWeatherData.weather[0].description;
  
//             responseText += `The current temperature in ${cityName} is ${temperature}°${selectedUnit}. The weather is ${weatherDescription}.\n`;
//           } else {
//             responseText += 'Current weather data is not available. Please fetch the weather data first.\n';
//           }
//         }
  
//         if (lowercaseMessage.includes('highest temperature')) {
//           // Find the entry with the highest temperature
//           const highestTempEntry = forecastData.reduce((maxEntry, currentEntry) => {
//             return currentEntry.main.temp > maxEntry.main.temp ? currentEntry : maxEntry;
//           }, forecastData[0]);
  
//           let highestTemp = highestTempEntry.main.temp;
//           highestTemp = convertTemperature(highestTemp).toFixed(1);
//           const [dateStr, time] = highestTempEntry.dt_txt.split(' ');
//           const weatherDescription = highestTempEntry.weather[0].description;
  
//           // Get the day of the week
//           const dateObj = new Date(highestTempEntry.dt_txt);
//           const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//           const dayOfWeek = daysOfWeek[dateObj.getDay()];
  
//           responseText += `The highest temperature this week is ${highestTemp}°${selectedUnit} on ${dayOfWeek} (${dateStr}) at ${time}. The weather was ${weatherDescription}.\n`;
//         }
  
//         if (lowercaseMessage.includes('lowest temperature')) {
//           // Find the entry with the lowest temperature
//           const lowestTempEntry = forecastData.reduce((minEntry, currentEntry) => {
//             return currentEntry.main.temp < minEntry.main.temp ? currentEntry : minEntry;
//           }, forecastData[0]);
  
//           let lowestTemp = lowestTempEntry.main.temp;
//           lowestTemp = convertTemperature(lowestTemp).toFixed(1);
//           const [dateStr, time] = lowestTempEntry.dt_txt.split(' ');
//           const weatherDescription = lowestTempEntry.weather[0].description;
  
//           // Get the day of the week
//           const dateObj = new Date(lowestTempEntry.dt_txt);
//           const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//           const dayOfWeek = daysOfWeek[dateObj.getDay()];
  
//           responseText += `The lowest temperature this week is ${lowestTemp}°${selectedUnit} on ${dayOfWeek} (${dateStr}) at ${time}. The weather was ${weatherDescription}.\n`;
//         }
  
//         if (lowercaseMessage.includes('average temperature')) {
//           // Compute the average temperature
//           const temperatures = forecastData.map(entry => entry.main.temp);
//           let averageTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
//           averageTemp = convertTemperature(averageTemp).toFixed(1);
  
//           responseText += `The average temperature this week is ${averageTemp}°${selectedUnit}.\n`;
//         }
        
  
//         // Display the response in the chatbot
//         addCustomResponseToChatbot(responseText);
//       } else {
//         addCustomResponseToChatbot(
//           'Temperature data is not available. Please fetch the weather data first.'
//         );
//       }
//     }
//   });


// Event listener for df-user-input-entered
window.addEventListener('df-user-input-entered', function (event) {
  const message = event.detail.input;
  const lowercaseMessage = message.toLowerCase();

  // Define keywords for each query type
  const highestTempKeywords = ['highest temperature', 'hottest', 'max temp', 'maximum temperature', 'warmest', 'peak temperature', 'high temp', 'hottest day'];
  const lowestTempKeywords = ['lowest temperature', 'coldest', 'min temp', 'minimum temperature', 'coolest', 'low temp', 'coldest day'];
  const averageTempKeywords = ['average temperature', 'mean temperature', 'average temp', 'typical temperature', 'usual temperature'];
  const currentTempKeywords = ['current temperature', 'temperature now', 'temp now', 'what is the temperature', 'how hot is it', 'how cold is it', 'what\'s the temp', 'current temp'];

  // Function to check if the message contains any of the keywords
  function messageContainsKeywords(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  // Check if the message is asking about temperatures
  if (
    messageContainsKeywords(lowercaseMessage, highestTempKeywords) ||
    messageContainsKeywords(lowercaseMessage, lowestTempKeywords) ||
    messageContainsKeywords(lowercaseMessage, averageTempKeywords) ||
    messageContainsKeywords(lowercaseMessage, currentTempKeywords)
  ) {
    // Prevent the message from being sent to Dialogflow
    event.preventDefault();
    event.stopImmediatePropagation();

    if (forecastData.length > 0 || currentWeatherData) {
      let responseText = '';

      if (messageContainsKeywords(lowercaseMessage, currentTempKeywords)) {
        if (currentWeatherData) {
          let temperature = currentWeatherData.main.temp;
          temperature = convertTemperature(temperature).toFixed(1);
          const cityName = currentWeatherData.name;
          const weatherDescription = currentWeatherData.weather[0].description;

          responseText += `The current temperature in ${cityName} is ${temperature}°${selectedUnit}. The weather is ${weatherDescription}.\n`;
        } else {
          responseText += 'Current weather data is not available. Please fetch the weather data first.\n';
        }
      }

      if (messageContainsKeywords(lowercaseMessage, highestTempKeywords)) {
        // Find the entry with the highest temperature
        const highestTempEntry = forecastData.reduce((maxEntry, currentEntry) => {
          return currentEntry.main.temp > maxEntry.main.temp ? currentEntry : maxEntry;
        }, forecastData[0]);

        let highestTemp = highestTempEntry.main.temp;
        highestTemp = convertTemperature(highestTemp).toFixed(1);
        const [dateStr, time] = highestTempEntry.dt_txt.split(' ');
        const weatherDescription = highestTempEntry.weather[0].description;

        // Get the day of the week
        const dateObj = new Date(highestTempEntry.dt_txt);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[dateObj.getDay()];

        responseText += `The highest temperature this week is ${highestTemp}°${selectedUnit} on ${dayOfWeek} (${dateStr}) at ${time}. The weather will be ${weatherDescription}.\n`;
      }

      if (messageContainsKeywords(lowercaseMessage, lowestTempKeywords)) {
        // Find the entry with the lowest temperature
        const lowestTempEntry = forecastData.reduce((minEntry, currentEntry) => {
          return currentEntry.main.temp < minEntry.main.temp ? currentEntry : minEntry;
        }, forecastData[0]);

        let lowestTemp = lowestTempEntry.main.temp;
        lowestTemp = convertTemperature(lowestTemp).toFixed(1);
        const [dateStr, time] = lowestTempEntry.dt_txt.split(' ');
        const weatherDescription = lowestTempEntry.weather[0].description;

        // Get the day of the week
        const dateObj = new Date(lowestTempEntry.dt_txt);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[dateObj.getDay()];

        responseText += `The lowest temperature this week is ${lowestTemp}°${selectedUnit} on ${dayOfWeek} (${dateStr}) at ${time}. The weather will be ${weatherDescription}.\n`;
      }

      if (messageContainsKeywords(lowercaseMessage, averageTempKeywords)) {
        // Compute the average temperature
        const temperatures = forecastData.map(entry => entry.main.temp);
        let averageTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        averageTemp = convertTemperature(averageTemp).toFixed(1);

        responseText += `The average temperature this week is ${averageTemp}°${selectedUnit}.\n`;
      }

      // Display the response in the chatbot
      addCustomResponseToChatbot(responseText);
    } else {
      addCustomResponseToChatbot(
        'Temperature data is not available. Please fetch the weather data first.'
      );
    }
  }
});

  
  

// Function to add custom response to the chatbot
function addCustomResponseToChatbot(text) {
  const dfMessenger = document.querySelector('df-messenger');
  if (dfMessenger && typeof dfMessenger.renderCustomText === 'function') {
    dfMessenger.renderCustomText(text);
  } else {
    console.error('renderCustomText method is not available on df-messenger');
  }
}



// Function to show the dashboard and hide the table
function showDashboard() {
  document.getElementById('dashboardSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('block');

  document.getElementById('tableSection').classList.remove('block');
  document.getElementById('tableSection').classList.add('hidden');

  AOS.refresh();

}

// Function to show the table and hide the dashboard
function showTable() {
  document.getElementById('tableSection').classList.remove('hidden');
  document.getElementById('tableSection').classList.add('block');

  document.getElementById('dashboardSection').classList.remove('block');
  document.getElementById('dashboardSection').classList.add('hidden');
AOS.refresh();
}

// Event listeners for navbar buttons
document.getElementById('dashboardNavBtn').addEventListener('click', showDashboard);
document.getElementById('tablesNavBtn').addEventListener('click', showTable);

// Event listeners for mobile navbar buttons
document.getElementById('mobileDashboardNavBtn').addEventListener('click', function() {
  showDashboard();
  // Close mobile sidebar
  document.getElementById('mobileSidebar').classList.add('hidden');
});

document.getElementById('mobileTablesNavBtn').addEventListener('click', function() {
  showTable();
  // Close mobile sidebar
  document.getElementById('mobileSidebar').classList.add('hidden');
});
