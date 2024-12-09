const replacor = document.querySelector('.replacor');
const locName = document.querySelector('#locSearchName');
const findButton = document.querySelector('#findButton');
const apiKey = "7ec8c98d737546cdbd2171329240912"; // Replace with your API key
// 002217fc01174c358da215724240812
// 2b23b078e99a41df8bb165712240912
// 7ec8c98d737546cdbd2171329240912


function getDayName(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}




function getImageForTemperature(temp) {
  if (temp <= 0) {
    return "./images/143.png"; // For temperatures <= 10°C
  } else if (temp <= 10) {
    return "./images/198.png"; // For temperatures > 10°C and <= 25°C
  }
  else if (temp <= 20) {
    return "./images/116.png"; // For temperatures > 10°C and <= 25°C
  }
  else if (temp <= 30) {
    return "./images/1.png"; // For temperatures > 10°C and <= 25°C
  }
  
  else {
    return "./images/1.png"; // For temperatures > 25°C
  }
}


function displayWeather(data) {
  let cartoona = "";
  const cityName = data.location.name; // City name
  const forecast = data.forecast.forecastday; // 3-day forecast

  cartoona += `
    <div class="col-md-12 text-center p-3">
      <h3 class="mb-4">${cityName}</h3>
      <div class="row justify-content-center">
  `;

  forecast.forEach((day) => {
    const dayName = getDayName(day.date);
    const temp = day.day.avgtemp_c; // Average temperature for the day
    const condition = day.day.condition.text; // Weather condition text
    // const conditionIcon = day.day.condition.icon; // API-provided icon
    const image = getImageForTemperature(temp); // Determine fallback image based on condition

    cartoona += `
      <div class="col-md-4 text-center p-3">
        <h4 class="mb-2">${dayName}</h4>
        <div class="weather-card p-4">
          <h5 class="mb-2">${cityName}</h5>
          <h1 class="display-5 mb-2">${temp}°C</h1>
          <img src="${image}" alt="${condition}" onerror="this.src=''">
          <p>${condition}</p>
          <div class="d-flex justify-content-around">
            <div><img src="./images/icon-umberella.png" alt="Umbrella Icon"><p>20%</p></div>
            <div><img src="./images/icon-wind.png" alt="Wind Icon"><p>18km/h</p></div>
            <div><img src="./images/icon-compass.png" alt="Compass Icon"><p>East</p></div>
          </div>       
        </div>
      </div>
    `;
  });

  cartoona += `
      </div>
    </div>
  `;

  replacor.innerHTML = cartoona;
}



function fetchWeather(query) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}


locName.addEventListener("keyup", function () {
  const query = locName.value.trim();
  if (query) {
    fetchWeather(query);
  }
});


findButton.addEventListener("click", function () {
  const query = locName.value.trim();
  if (query) {
    fetchWeather(query);
  }
});

// Geolocation API to fetch user's location
function fetchUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }
}


fetchUserLocation();
