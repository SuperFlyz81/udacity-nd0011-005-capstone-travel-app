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

/*
Main function expressions
*/
// Function expression - Preform some input validation before continuing.
const validateInput = async (locationName, departureDate) => {
  // console.log('Running validateInput function; // Debug code.

  // Validate that a location was entered, and reject this async function's return promise immediately if it wasn't (by throwing an error).
  if (!locationName) {
    throw `Blank location entered.\n\nPlease enter a valid location name and then try again.`;
  }
  // Also validate that a valid, future-dated, "within 7 days" departure date was entered, and reject this async function's return promise immediately if it wasn't (by throwing an error).
  if (!isValidDate(departureDate)) {
    // If not a valid date.
    throw `Blank or invalid departure date entered.\n\nPlease enter a valid departure date and then try again.`;
  } else if (calcDayDifference(undefined, departureDate) < 0) {
    // A valid date has been entered, but it is in the past.
    throw `The departure date entered is in the past.\n\nPlease enter a present or future-dated departure date and then try again.`;
  } else if (calcDayDifference(undefined, departureDate) > 6) {
    // A valid date has been entered, but it is more than 7 days in the future (so more than the Weatherbit web API supports for future forecasts).
    throw `The departure date entered is more than 7 days in the future. We can only provide weather forecasts for 7 days from the present date.\n\nPlease enter a departure date within 7 days from today's date and then try again.`;
  }
}

// Function expression - Get geo data for a location from the GeoNames web API.
const getGeoData = async (locationName, departureDate) => {
  // console.log('Running getGeoData function (i.e. GeoNames web API GET request)'); // Debug code.

  /* See https://www.geonames.org/export/geonames-search.html for the GeoNames web API documentation and a location based search web API call example.
  Had to register for a free GeoNames account to receive an API key to use with this project.
  Note, all API keys are retrieved using an Express server route via the dotenv Node module to keep API keys locally and not expose/upload them to version control on the Internet (i.e. to GitHub). */
  const baseURL = 'http://api.geonames.org/searchJSON?q=';
  // const apikey = 'API key goes here'; // Debug code.

  let apiKey = '&maxRows=1&username='; // Note that we are only fetching one row (maxRows=1), i.e. the top result, from the GeoNames web API.
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
  console.log(data['geonames'][0]); // Debug code.

  // If valid geo data was received back from the GeoNames web API, then resolve this async function's return promise (by returning the retrieved data).
  if (data.totalResultsCount !== 0) {
    /* Return the valid fetched geo data.
    The GeoNames web API can return a JSON object containing multiple arrays with results.
    But we are only fetching and then returning the top result (by setting maxRows=1 in the query above to the GeoNames web API). */
    return data['geonames'][0];
  }

  /* Otherwise, if code execution has reached this point, it means that data was returned back from the GeoNames web API, but it was invalid data.
  This happens, for example, when a location could not be located by the GeoNames web API.
  In this case, throw an error to reject this async function's return promise (returning an error object). */
  throw `Could not find a location matching the name you entered.\n\nPlease ensure that you have entered a valid location name and then try again.`;
};

// Function expression - Get weather data from the Weatherbit web API and image data from the Pixabay web API.
const getWeatherAndImageData = async (geoData) => {
  // console.log('Running getWeatherAndImageData function (i.e. Weatherbit and Pixabay web API GET requests)'); // Debug code.

  /* See https://www.weatherbit.io/api/weather-forecast-16-day for the Weatherbit 16 Day Weather Forecast (1 day interval) web API documentation and an example request and response.
  Note that the Weatherbit 16 Day Weather Forecast web API only returns 7 days worth of forecast when using the free Weatherbit plan.
  Had to register for a free Weatherbit account to receive an API key to use with this project.
  Note, all API keys are retrieved using an Express server route via the dotenv Node module to keep API keys locally and not expose/upload them to version control on the Internet (i.e. to GitHub). */
  const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=' + geoData.latitude + '&lon=' + geoData.longitude;
  // const apikey = 'API key goes here'; // Debug code.

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

  // Try to get weather data using the fetch browser API.
  const response = await fetch(baseURL + apiKey);

  // Assign the fetched weather data (in JSON format) to a variable.
  const weatherData = await response.json();
  // console.log(weatherData); // Debug code.
  console.log(weatherData.data[0]); // Debug code.
  console.log(weatherData.data[6]); // Debug code.
  console.log(weatherData.data[calcDayDifference(undefined, geoData.departureDate)]); // Debug code.

  // If valid weather data was received back from the Weatherbit web API, then resolve this async function's return promise (by returning the retrieved data).
  if (weatherData.hasOwnProperty('data')) {
    /* Return the valid fetched weather data.
    The Weatherbit 16 Day Weather Forecast (1 day interval) web API returns a JSON object containing multiple days' weather forecasts.
    But we are only returning the weather data for the current date and the departure date (which could be the same date as the current date if the user selected today's date in the UI). */
    return geoData; // TODO - Just returning the data received by the function for now. This needs to return the data received by the function + data from Weatherbit and Pixabay
  }

  /* Otherwise, if code execution has reached this point, it means that data was returned back from the Weatherbit web API, but it was invalid data.
  This happens, for example, when a the daily limit of requests using the Weatherbit free plan of 50 calls per day has been exceeded.
  In this case, throw an error to reject this async function's return promise (returning an error object). */
  throw `Could not retrieve weather data for the location you entered\n\nPlease ensure that that the Weatherbit API is operational at https://status.weatherbit.io and then try again.`;
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
  document.getElementById('location-name-result').innerHTML = data.locationName;
  document.getElementById('departure-date-result').innerHTML = data.departureDate;
  document.getElementById('region-name-result').innerHTML = data.regionName;
  document.getElementById('country-name-result').innerHTML = data.countryName;
  document.getElementById('latitude-result').innerHTML = data.latitude;
  document.getElementById('longitude-result').innerHTML = data.longitude;
  document.getElementById('population-result').innerHTML = data.population;
  document.getElementById('departure-date-countdown-result').innerHTML = calcDayDifference(undefined, data.departureDate) + ' day(s) until your trip';
};

/*
Main functions
*/
// Function - Main button click event handler function that performs all the actions, calls all the functions, and handles all the promises in our code.
function performActions(event) {
  // Call a function to validate the user input from your UI.
  validateInput(document.getElementById('location-name').value, document.getElementById('departure-date').value)
    .then(result => {
      // Call a function to get geo data from the GeoNames web API.
      getGeoData(document.getElementById('location-name').value, document.getElementById('departure-date').value)
        // Then post the data retrieved from the GeoNames web API along with the data entered by the user to the Express server's POST route.
        /* Note the use of chained promises below by using .then().
        This handles the fulfilled and rejected states of the promise returned by the getGeoData async function. */
        .then(result => {
          // This arrow callback function runs when the getGeoData async function returns a resolved promise with a result.

          // Build the data object.
          const geoData = {
            locationName: result.name,
            departureDate: document.getElementById('departure-date').value,
            regionName: result.adminName1,
            countryName: result.countryName,
            latitude: result.lat,
            longitude: result.lng,
            population: result.population
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
              /* Appropriately handle any errors that might occur when fetching weather and location image data (for example, when the Weatherbit or Pixabay web APIs are down or not reachable).
              Catches errors in both fetch() and response.json() in the getWeatherAndImageData async function, as well as any other errors that might occur in that function. */
              alert(`The following error occurred while retrieving data from the Weatherbit or Pixabay web APIs:\n${error}`);
            })
        }, error => {
          // This arrow callback function runs when the getGeoData async function returns a rejected promise with an error.
          /* Appropriately handle any errors that might occur when fetching geo data (for example, when an GeoNames web API is down or not reachable).
          Catches errors in both fetch() and response.json() in the getGeoData async function, as well as any other errors that might occur in that function. */
          alert(`The following error occurred while retrieving data from the GeoNames web API:\n${error}`);
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