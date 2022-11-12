/*
Client app.js
*/

/*
Global variables
*/
// Nothing here.

/*
Helper functions and function expressions
*/
// Function expression - Calculate the difference, in days, between two date strings. Note, the fromDate parameter defaults to today's date (new Date()) if no from date is passed to this function expression (i.e., if undefined is passed as the fromDate argument).
const calcDayDifference = (fromDate = new Date(), toDate) => {
  const difference = new Date(toDate).getTime() - new Date(fromDate).getTime();
  const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return totalDays;
}

// Function expression - Calculate the difference, in days, between two dates.
const isValidDate = (testDate) => {
  const newTestDate = new Date(testDate);
  return newTestDate instanceof Date && !isNaN(newTestDate);
}

// Function expression - Convert Unix timestamp to time in hh:mm format.
const convertUnixTimestampToTime = (unixTimestamp) => {
  /* Code adapted from: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  Create a new JavaScript Date object based on the Unix timestamp.
  Then multiply it by 1000 so that the argument is in milliseconds, not seconds. */
  const date = new Date(unixTimestamp * 1000);
  // Hours part from the timestamp.
  const hours = date.getHours();
  // Minutes part from the timestamp.
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp.
  //const seconds = "0" + date.getSeconds();

  // Will display the ime in hh:mm format.
  const formattedTime = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2); // + ':' + ("0" + seconds).slice(-2);

  return formattedTime;
}

/*
Main function expressions
*/
// Function expression - Preform some input validation before continuing.
const validateInput = async (locationName, arrivalDate) => {
  // console.log('Running validateInput function; // Debug code.

  // Validate that a location was entered, and reject this async function's return promise immediately if it wasn't (by throwing an error).
  if (!locationName) {
    throw `Blank location entered.\n\nPlease enter a valid location name and then try again.`;
  }
  // Also validate that a valid, future-dated, "within 7 days" arrival date was entered, and reject this async function's return promise immediately if it wasn't (by throwing an error).
  if (!isValidDate(arrivalDate)) {
    // If not a valid date.
    throw `Blank or invalid arrival date entered.\n\nPlease enter a valid arrival date and then try again.`;
  } else if (calcDayDifference(undefined, arrivalDate) < 0) {
    // A valid date has been entered, but it is in the past.
    throw `The arrival date entered is in the past.\n\nPlease enter a present or future-dated arrival date and then try again.`;
  } else if (calcDayDifference(undefined, arrivalDate) > 6) {
    // A valid date has been entered, but it is more than 7 days in the future (so more than the Weatherbit API supports for future forecasts).
    throw `The arrival date entered is more than 7 days in the future. We can only provide weather forecasts for 7 days from the present date.\n\nPlease enter a arrival date within 7 days from today's date and then try again.`;
  }
}

// Function expression - Get geo data for a location from the GeoNames API.
const getGeoData = async (locationName, arrivalDate) => {
  // console.log('Running getGeoData function (i.e. GeoNames API GET request)'); // Debug code.

  /* See https://www.geonames.org/export/geonames-search.html for the GeoNames API documentation and a location based search API call example.
  Had to register for a free GeoNames account to receive an API key to use with this project.
  Note, all API keys are retrieved using an Express server route via the dotenv Node module to keep API keys locally and not expose/upload them to version control on the Internet (i.e. to GitHub). */
  const baseURL = 'http://api.geonames.org/searchJSON?q=';
  // const apikey = 'API key goes here'; // Debug code.

  let apiKey = '&maxRows=1&username='; // Note that we are only fetching one row (maxRows=1), i.e. the top result, from the GeoNames API.
  try {
    /* One liner below to perform an Express server route get using the fetch browser API, async JavaScript code, and JavaScript promises.
    See the following URL for more details: https://stackoverflow.com/questions/61814037/fetch-request-and-convert-it-to-json-in-a-single-line */
    apiKey += await (await fetch('http://localhost:8081/getapikey?dotenv=GEONAMES_API_USERNAME')).text();
    // console.log(apiKey); // Debug code.
  }
  catch(err) {
    throw `Could not retrieve the GeoNames API key from the Express server.\n\nPlease ensure that the Express server is running and then try again.`;
  }

  // Try to get geo data using the fetch browser API.
  const response = await fetch(baseURL + locationName + apiKey);

  // Assign the fetched geo data (in JSON format) to a variable.
  const data = await response.json();
  // console.log(data); // Debug code.
  // console.log(data['geonames'][0]); // Debug code.

  // If valid geo data was received back from the GeoNames API, then resolve this async function's return promise (by returning the retrieved data).
  if (data.totalResultsCount !== 0) {
    /* Return the valid fetched geo data.
    The GeoNames API can return a JSON object containing multiple arrays with results.
    But we are only fetching and then returning the top result (by setting maxRows=1 in the query above to the GeoNames API). */
    return data['geonames'][0];
  }

  /* Otherwise, if code execution has reached this point, it means that data was returned back from the GeoNames API, but it was invalid data.
  This happens, for example, when a location could not be located by the GeoNames API.
  In this case, throw an error to reject this async function's return promise (returning an error object). */
  throw `Could not find a location matching the name you entered.\n\nPlease ensure that you have entered a valid location name and then try again.`;
};

// Function expression - Get the current and forecast weather data from the Weatherbit API and the location image data from the Pixabay API.
const getWeatherAndImageData = async (geoData) => {
  // console.log('Running getWeatherAndImageData function (i.e. Weatherbit and Pixabay API GET requests)'); // Debug code.
  const arrivalDayIndex = geoData.arrivalCountdown;

  // Get Weatherbit API key from Express server.
  /* Had to register for a free Weatherbit account to receive an API key to use with this project.
  Note, all API keys are retrieved using an Express server route via the dotenv Node module to keep API keys locally and not expose/upload them to version control on the Internet (i.e. to GitHub). */
  let apiKey = '&key=';
  try {
    /* One liner below to perform an Express server route get using the fetch browser API, async JavaScript code, and JavaScript promises.
    See the following URL for more details: https://stackoverflow.com/questions/61814037/fetch-request-and-convert-it-to-json-in-a-single-line */
    apiKey += await (await fetch('http://localhost:8081/getapikey?dotenv=WEATHERBIT_API_KEY')).text();
    // console.log(apiKey); // Debug code.
  }
  catch(err) {
    throw `Could not retrieve the Weatherbit API key from the Express server.\n\nPlease ensure that the Express server is running and then try again.`;
  }

  // Get current weather data.
  // See https://www.weatherbit.io/api/weather-current for the Weatherbit Current Weather API documentation and an example request and response.
  let baseURL = 'https://api.weatherbit.io/v2.0/current?lat=' + geoData.latitude + '&lon=' + geoData.longitude;

  // Try to get weather data using the fetch browser API.
  const responseWeatherCurrent = await fetch(baseURL + apiKey);

  // Assign the fetched weather data (in JSON format) to a variable.
  const dataWeatherCurrent = await responseWeatherCurrent.json();
  // console.log(dataWeatherCurrent); // Debug code.
  // console.log(dataWeatherCurrent.data[0]); // Debug code.

  /* Check if any errors occurred while fetching data from the Weatherbit API.
  This happens, for example, when a the daily limit of requests using the Weatherbit free plan of 50 calls per day has been exceeded.
  In this case, throw an error to reject this async function's return promise (returning an error object). */
  if (dataWeatherCurrent.hasOwnProperty('error')) {
    throw `Could not retrieve current weather data for the location you entered.\n\nError details:\n${dataWeatherCurrent.error}\n\nPlease ensure that the Weatherbit API is operational at https://status.weatherbit.io and then try again.`;
  } else if (!dataWeatherCurrent.hasOwnProperty('data')) {
    throw `Could not retrieve current weather data for the location you entered.\n\nPlease ensure that the Weatherbit API is operational at https://status.weatherbit.io and then try again.`;
  }

  // Get forecast weather data.
  /* See https://www.weatherbit.io/api/weather-forecast-16-day for the Weatherbit 16 Day Weather Forecast (1 day interval) API documentation and an example request and response.
  Note that the Weatherbit 16 Day Weather Forecast API only returns 7 days worth of forecast when using the free Weatherbit plan. */
  baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=' + geoData.latitude + '&lon=' + geoData.longitude + '&days=' + (arrivalDayIndex + 1);

  // Try to get weather data using the fetch browser API.
  const responseWeatherForecast = await fetch(baseURL + apiKey);

  // Assign the fetched weather data (in JSON format) to a variable.
  const dataWeatherForecast = await responseWeatherForecast.json();
  // console.log(dataWeatherForecast); // Debug code.
  // console.log(dataWeatherForecast.data[0]); // Debug code.
  // console.log(dataWeatherForecast.data[6]); // Debug code.
  // console.log(dataWeatherForecast.data[arrivalDayIndex]); // Debug code.

  /* Check if any errors occurred while fetching data from the Weatherbit API.
  This happens, for example, when a the daily limit of requests using the Weatherbit free plan of 50 calls per day has been exceeded.
  In this case, throw an error to reject this async function's return promise (returning an error object). */
  if (dataWeatherForecast.hasOwnProperty('error')) {
    throw `Could not retrieve forecast weather data for the location you entered.\n\nError details:\n${dataWeatherForecast.error}\n\nPlease ensure that the Weatherbit API is operational at https://status.weatherbit.io and then try again.`;
  } else if (!dataWeatherForecast.hasOwnProperty('data')) {
    throw `Could not retrieve forecast weather data for the location you entered.\n\nPlease ensure that the Weatherbit API is operational at https://status.weatherbit.io and then try again.`;
  }

  // Get Pixabay API key from Express server.
  /* Had to register for a free Pixabay account to receive an API key to use with this project.
  Note, all API keys are retrieved using an Express server route via the dotenv Node module to keep API keys locally and not expose/upload them to version control on the Internet (i.e. to GitHub). */
  apiKey = '&key=';
  try {
    /* One liner below to perform an Express server route get using the fetch browser API, async JavaScript code, and JavaScript promises.
    See the following URL for more details: https://stackoverflow.com/questions/61814037/fetch-request-and-convert-it-to-json-in-a-single-line */
    apiKey += await (await fetch('http://localhost:8081/getapikey?dotenv=PIXABAY_API_KEY')).text();
    // console.log(apiKey); // Debug code.
  }
  catch(err) {
    throw `Could not retrieve the Pixabay API key from the Express server.\n\nPlease ensure that the Express server is running and then try again.`;
  }

  // Get image data.
  // See https://pixabay.com/api/docs/ for the Pixabay API documentation and an example request and response.
  baseURL = 'https://pixabay.com/api/?safesearch=true&per_page=3&q=' + encodeURIComponent(geoData.locationName);

  let locationImageURL = '';

  try {
    // Try to get image data using the fetch browser API.
    const responseImage = await fetch(baseURL + apiKey);

    // Assign the fetched image data (in JSON format) to a variable.
    const dataImage = await responseImage.json();
    // console.log(dataImage); // Debug code.
    // console.log(dataImage.hits[0]); // Debug code.
    
    locationImageURL = dataImage.total > 0 ? dataImage.hits[0].webformatURL : '';
  } catch(err) {
    // Catches http, connection, and other errors.
    /* If an error occurs while fetching image data from Pixabay (let's say the Pixabay site or API is down), then just set the locationImageURL to blank.
    We don't explicitly need a location image for our travel planner website to work. So, no need to throw an error if we can't find an image for our location. */
    locationImageURL = '';
  }
  // console.log(locationImageURL); // Debug code.

  // Build a new object using the previously retrieved geo data and the newly retrieved current weather data, forecast weather data, and location image data.
  const allData = {
    locationName: geoData.locationName,
    arrivalDate: geoData.arrivalDate,
    regionName: geoData.regionName,
    countryName: geoData.countryName,
    latitude: geoData.latitude,
    longitude: geoData.longitude,
    population: geoData.population,
    arrivalCountdown: arrivalDayIndex,
    weatherData: [
      // Current weather object (inside the all data object).
      {
        icon: dataWeatherCurrent.data[0].weather.icon,
        description: dataWeatherCurrent.data[0].weather.description,
        temp: dataWeatherCurrent.data[0].temp,
        feelslikeTemp: dataWeatherCurrent.data[0].app_temp,
        maxTemp: dataWeatherForecast.data[arrivalDayIndex].max_temp,
        minTemp: dataWeatherForecast.data[arrivalDayIndex].min_temp,
        chanceOfRain: dataWeatherForecast.data[arrivalDayIndex].pop,
        windSpeed: dataWeatherCurrent.data[0].wind_spd,
        windGustSpeed: dataWeatherCurrent.data[0].gust,
        windDirection: dataWeatherCurrent.data[0].wind_cdir_full,
        cloudCoverage: dataWeatherCurrent.data[0].clouds,
        uvIndex: dataWeatherCurrent.data[0].uv,
        humidity: dataWeatherCurrent.data[0].rh,
        sunriseTime: dataWeatherCurrent.data[0].sunrise,
        sunsetTime: dataWeatherCurrent.data[0].sunset
      },
      // Forecase weather object (inside the all data object).
      {
        icon: dataWeatherForecast.data[arrivalDayIndex].weather.icon,
        description: dataWeatherForecast.data[arrivalDayIndex].weather.description,
        temp: dataWeatherForecast.data[arrivalDayIndex].temp,
        feelslikeTemp: '',
        maxTemp: dataWeatherForecast.data[arrivalDayIndex].max_temp,
        minTemp: dataWeatherForecast.data[arrivalDayIndex].min_temp,
        chanceOfRain: dataWeatherForecast.data[arrivalDayIndex].pop,
        windSpeed: dataWeatherForecast.data[arrivalDayIndex].wind_spd,
        windGustSpeed: dataWeatherForecast.data[arrivalDayIndex].wind_gust_spd,
        windDirection: dataWeatherForecast.data[arrivalDayIndex].wind_cdir_full,
        cloudCoverage: dataWeatherForecast.data[arrivalDayIndex].clouds,
        uvIndex: dataWeatherForecast.data[arrivalDayIndex].uv,
        humidity: dataWeatherForecast.data[arrivalDayIndex].rh,
        sunriseTime: convertUnixTimestampToTime(dataWeatherForecast.data[arrivalDayIndex].sunrise_ts),
        sunsetTime: convertUnixTimestampToTime(dataWeatherForecast.data[arrivalDayIndex].sunset_ts)
      }
    ],
    locationImageURL: locationImageURL
  }
  // console.log(allData); // Debug code.

  // Return the newly built object containing all our geo, current weather, forecast weather, and location image data.
  return allData;
};

// Function expression - Post data to the Express server's POST route.
const sendData = async (url, data) => {
  // console.log('Running sendData function (i.e. Express server POST request)'); // Debug code.
  
  // Try to post data using the fetch browser API.
  const response = await fetch(url, {
  method: 'POST', 
  credentials: 'same-origin', 
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(data) // Body data type must match "Content-Type" header.
  });

  // Assign the response to the post (in JSON format) to a variable.
  const responseData = await response.json();
  
  // Return the response.
  return responseData;
};

// Function expression - Get data from the Express server's GET route and then update the UI.
const retrieveData = async () => {
  // console.log('Running retrieveData function (i.e. Express server GET request)'); // Debug code.

  // Try to get data using the fetch browser API.
  const response = await fetch('http://localhost:8081/getdata');

  // Assign the fetched data (in JSON format) to a variable.
  const data = await response.json();

  // Update the UI by assigning the fetched data to DOM elements.
  document.getElementById('location-name').innerHTML = data.locationName;
  document.getElementById('arrival-date').innerHTML = data.arrivalDate;
  document.getElementById('region-name').innerHTML = data.regionName;
  document.getElementById('country-name').innerHTML = data.countryName;
  document.getElementById('latitude').innerHTML = data.latitude;
  document.getElementById('longitude').innerHTML = data.longitude;
  document.getElementById('population').innerHTML = data.population;
  document.getElementById('arrival-date-countdown').innerHTML = data.arrivalCountdown + ' day(s) until your trip';
  
  document.getElementById('current-icon').innerHTML = data.weatherData[0].icon;
  document.getElementById('current-description').innerHTML = data.weatherData[0].description;
  document.getElementById('current-temp').innerHTML = data.weatherData[0].temp;
  document.getElementById('current-feels-like-temp').innerHTML = data.weatherData[0].feelslikeTemp;
  document.getElementById('current-max-temp').innerHTML = data.weatherData[0].maxTemp;
  document.getElementById('current-min-temp').innerHTML = data.weatherData[0].minTemp;
  document.getElementById('current-chance-of-rain').innerHTML = data.weatherData[0].chanceOfRain;
  document.getElementById('current-wind-speed').innerHTML = data.weatherData[0].windSpeed;
  document.getElementById('current-wind-gust-speed').innerHTML = data.weatherData[0].windGustSpeed;
  document.getElementById('current-wind-direction').innerHTML = data.weatherData[0].windDirection;
  document.getElementById('current-cloud-coverage').innerHTML = data.weatherData[0].cloudCoverage;
  document.getElementById('current-uv-index').innerHTML = data.weatherData[0].uvIndex;
  document.getElementById('current-humidity').innerHTML = data.weatherData[0].humidity;
  document.getElementById('current-sunrise-time').innerHTML = data.weatherData[0].sunriseTime;
  document.getElementById('current-sunset-time').innerHTML = data.weatherData[0].sunsetTime;

  document.getElementById('arrival-icon').innerHTML = data.weatherData[1].icon;
  document.getElementById('arrival-description').innerHTML = data.weatherData[1].description;
  document.getElementById('arrival-temp').innerHTML = data.weatherData[1].temp;
  document.getElementById('arrival-feels-like-temp').innerHTML = data.weatherData[1].feelslikeTemp;
  document.getElementById('arrival-max-temp').innerHTML = data.weatherData[1].maxTemp;
  document.getElementById('arrival-min-temp').innerHTML = data.weatherData[1].minTemp;
  document.getElementById('arrival-chance-of-rain').innerHTML = data.weatherData[1].chanceOfRain;
  document.getElementById('arrival-wind-speed').innerHTML = data.weatherData[1].windSpeed;
  document.getElementById('arrival-wind-gust-speed').innerHTML = data.weatherData[1].windGustSpeed;
  document.getElementById('arrival-wind-direction').innerHTML = data.weatherData[1].windDirection;
  document.getElementById('arrival-cloud-coverage').innerHTML = data.weatherData[1].cloudCoverage;
  document.getElementById('arrival-uv-index').innerHTML = data.weatherData[1].uvIndex;
  document.getElementById('arrival-humidity').innerHTML = data.weatherData[1].humidity;
  document.getElementById('arrival-sunrise-time').innerHTML = data.weatherData[1].sunriseTime;
  document.getElementById('arrival-sunset-time').innerHTML = data.weatherData[1].sunsetTime;

  document.getElementById('location-image-url').innerHTML = data.locationImageURL;
};

/*
Main functions
*/
// Function - Main button click event handler function that performs all the actions, calls all the functions, and handles all the promises in our code.
function performActions(event) {
  // Call a function to validate the user input from your UI.
  validateInput(document.getElementById('location-name-input').value, document.getElementById('arrival-date-input').value)
    .then(result => {
      // Call a function to get geo data from the GeoNames API.
      getGeoData(document.getElementById('location-name-input').value, document.getElementById('arrival-date-input').value)
        // Then post the data retrieved from the GeoNames API along with the data entered by the user to the Express server's POST route.
        /* Note the use of chained promises below by using .then().
        This handles the fulfilled and rejected states of the promise returned by the getGeoData async function. */
        .then(result => {
          // This arrow callback function runs when the getGeoData async function returns a resolved promise with a result.

          // Build the geo data object.
          const arrivalDate = document.getElementById('arrival-date-input').value;

          const geoData = {
            locationName: result.name,
            arrivalDate: arrivalDate,
            regionName: result.adminName1,
            countryName: result.countryName,
            latitude: result.lat,
            longitude: result.lng,
            population: result.population,
            arrivalCountdown: calcDayDifference(undefined, arrivalDate)
          };
        
          getWeatherAndImageData(geoData)
            .then(result => {
              // Post data to the Express server's POST route.
              sendData('http://localhost:8081/postdata', result)
              // Next, get data back from the Express server's GET route and update the UI.
              /* Note the use of chained promises below by using .then().
              This handles the fulfilled and rejected states of the promise returned by the sendData async function */
                .then(retrieveData, error => {
                  // This arrow callback function runs when the sendData async function returns a rejected promise with an error (side note, it runs the retrieveData async function above if sendData returns a resolved promise with a result).
                  /* Appropriately handle any errors that might occur during the post (for example, when the Express server is not running or is inaccessible)
                  Catches errors in both fetch() and response.json() in the sendData async function, as well as any other errors that might occur in the that function. */
                  alert(`The following error occurred while sending data to the Express server:\n${error}`);
                })
                  .catch(error => {
                    // This arrow callback function runs when the retrieveData async function returns a rejected promise with an error (side note, for the receiveData async function, we are only interested in errors, hence the use of .catch() instead of .then() above).
                    /* Appropriately handle any errors that might occur during the get (for example, when the Express server is not running or is inaccessible)
                    Catches errors in both fetch() and response.json() in the retrieveData async function, as well as any other errors that might occur in the that function. */
                    alert(`The following error occurred while retrieving data from the Express server:\n${error}`);
                  });
            }, error => {
              // This arrow callback function runs when the getWeatherAndImageData async function returns a rejected promise with an error.
              /* Appropriately handle any errors that might occur when fetching weather data (for example, when the Weatherbit API is down or not reachable).
              Catches errors in both fetch() and response.json() in the getWeatherAndImageData async function, as well as any other errors that might occur in that function.
              Note that we are not worried about errors that might occur when fetching image data from the Pixabay API since we don't explicitly need a location image for our travel planner website to work. 
              So, the getWeatherAndImageData function will just return a blank location image URL if it can't connect to the Pixabay API or if it can't find an image for our location. */
              alert(`The following error occurred while retrieving data from the Weatherbit API:\n${error}\n\nPlease ensure that you have not exceeded your free daily quota of 50 calls per day to the Weatherbit API and if so, please try again tomorrow.\n\nAlso ensure that the Weatherbit API is operational at https://status.weatherbit.io.`);
            })
        }, error => {
          // This arrow callback function runs when the getGeoData async function returns a rejected promise with an error.
          /* Appropriately handle any errors that might occur when fetching geo data (for example, when an GeoNames API is down or not reachable).
          Catches errors in both fetch() and response.json() in the getGeoData async function, as well as any other errors that might occur in that function. */
          alert(`The following error occurred while retrieving data from the GeoNames API:\n${error}`);
        })
    }, error => {
      // This arrow callback function runs when the validateInput async function returns a rejected promise with an error.
      alert(`The following error occurred:\n${error}`);
    });
}

/*
Events
*/
/* The addEventListener line below was wrapped inside a function (createSubmitButtonEventListener) which is exported below and then imported into the main client index.js file (/src/client/index.js).
The imported createSubmitButtonEventListener function is then exported again inside an IIFE (immediately invoked function expression) at the end of the client index.js file.
See the IIFE code and comments at the end of the client index.js file (/src/client/index.js) as to why this was done. */
function createSubmitButtonEventListener() {
  document.getElementById('submit-button').addEventListener('click', performActions);
}

// The same wrapped EventListener function in conjunction with export and IIFE pattern as described above is used below.
function createEnterKeyEventListener() {
  document.addEventListener("keypress", event => {
    // If the user presses the "Enter" key on the keyboard.
    if (event.key === "Enter") {
      // Cancel the default action, if needed.
      event.preventDefault();
      // Trigger the button element with a click.
      document.getElementById("submit-button").click();
    }
  });
}

/*
Global code
*/
// Nothing here.

/*
Exports
*/
// See https://www.w3schools.com/js/js_modules.asp for details on JavaScript module exports and import.
export {
  performActions,
  createSubmitButtonEventListener,
  createEnterKeyEventListener
};