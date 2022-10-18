/*
Global variables
*/
/* See https://openweathermap.org/current#zip for the OpenWeatherMap web API documentation and a ZIP code based web API call example.
The country code API parameter is set to "us", so we are targeting United States ZIP codes only.
The units API parameter is set to "imperial", so temperature data will be returned in Fahrenheit.
Also had to register for a free OpenWeatherMap account to receive the API key below to use with this project. */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = ',us&units=imperial&appid=45d0d4c373300ea5deb886984cee74e4';

/*
Function expressions
*/
// Function expression - Get weather data for a US ZIP code from the OpenWeatherMap web API
const getWeatherData = async (baseURL, zipCode, key) => {
  // console.log('Running getWeatherData function (i.e. OpenWeatherMap web API GET request)'); // Debug code.
  
  // Validate that a numeric ZIP code was entered, and reject this async function's return promise immediately if it wasn't (by throwing an error)
  if (!zipCode || isNaN(zipCode)) {
    throw new Error(`Non numeric ZIP code entered.\n\nPlease enter a valid ZIP code and then try again.`);
  }

  // Try to get weather data using the fetch browser API
  const response = await fetch(baseURL + zipCode + key);

  // Assign the fetched weather data (in JSON format) to a variable
  const data = await response.json();
  // console.log(data); // Debug code
  // console.log(data.cod); // Debug code

  // If valid weather data was received back from the OpenWeatherMap web API, then resolve this async function's return promise (by returning the retrieved data)
  if (response.status === 200) {
    // Return the valid fetched weather data
    return data;
  }

  /* Otherwise, if code execution has reached this point, it means that data was returned back from the OpenWeatherMap web API, but it was invalid data.
  This can happen if, for example, the user enters a numeric ZIP code that doesn't exist (so, if they just enter a random number).
  If this is the case, then throw an error to reject this async function's return promise (returning an error object). */
  throw new Error(`Error code ${data.cod} - ${data.message}.\n\nPlease ensure that you have entered a valid ZIP code and then try again.`);
}

// Function expression - Post data to the Express server's POST route
const sendData = async (url, newData) => {
  // console.log('Running sendData function (i.e. Express server POST request)'); // Debug code.
  
  // Try to post data using the fetch browser API
  const response = await fetch(url, {
  method: 'POST', 
  credentials: 'same-origin', 
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(newData) // Body data type must match "Content-Type" header        
  });

  // Assign the response to the post (in JSON format) to a variable
  const data = await response.json();
  
  // Return the response
  return data;
};

// Function expression - Get data from the Express server's GET route and then update the UI
/* Note that the try/catch statements has been removed from the Udacity project rubric sample code below.
And I'm not using try/catch statements in any of my other async functions either.
This was done since catching an error in an async function DOES NOT reject the promise returned by that async function!
To clarify, with a try/catch statement present in an async function, the promise returned by that async function will still resolve even if an error occurs and is caught in that async function (and not reject as you might think).
Our weather journal app calls for a sequence of asynchronous tasks to be performed one after another, but only if the preceding asynchronous task executed successfully.
To facilitate this, instead of using try/catch statements in my async functions, I'm using proper promise chaining resolved/rejected based error handling callbacks in the calling function instead. */
const retrieveData = async () => {
  // console.log('Running retrieveData function (i.e. Express server GET request)'); // Debug code.

  // Try to get data using the fetch browser API
  const response = await fetch('/getdata');

  // Assign the fetched data (in JSON format) to a variable
  const data = await response.json();

  // Update the UI by assigning the fetched data to DOM elements
  document.getElementById('temp').innerHTML = Math.round(data.temp) + ' degrees';
  document.getElementById('content').innerHTML = data.feel;
  document.getElementById('date').innerHTML = data.date;
 }

/*
Main functions
*/
// Function - Main button click event handler function that performs all the actions, calls all the functions, and handles all the promises in our code
function performActions(event) {
  // Call a function to get weather data from the OpenWeatherMap web API
  getWeatherData(baseURL, document.getElementById('zip').value, apiKey)

    // Then post the data retrieved from the OpenWeatherMap web API along with the data entered by user to the Express server's POST route
    /* Note the use of chained promises below by using .then().
    This handles the fulfilled and rejected states of the promise returned by the getWeatherData async function */
    .then(result => {
      // This arrow callback function runs when the getWeatherData async function returns a resolved promise with a result

      // Prepare data to be posted
      /* Convert Unix, UTC timestamp returned by the OpenWeatherMap web API to a date string.
      See the following URL for more details on JavaScript date conversion:
      https://timestamp.online/article/how-to-convert-timestamp-to-datetime-in-javascript */
      const d = new Date(result.dt * 1000);
      /* Note that date format below is in American format, so m/d/yyyy.
      Also note that I had to add 1 to the value returned by the getMonth() method below.
      This is because some of JavaScript's date functions/methods are zero-based (but not all of them).
      For example, the The date.getMonth() method returns the month in the specified date as a zero-based value (where zero indicates the first month of the year).
      So, months returned by the getMonth() method run from 0 to 11 instead of 1 to 12. */
      const dateString = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

      // Build data object
      const newData = {
        temp: result.main.temp,
        date: dateString,
        feel: document.getElementById('feelings').value
      };
    
      // Post data to the Express server's POST route
      sendData('/postdata', newData)
    
        // And finally, get data back from the Express server's GET route and update the UI
        /* Note the use of chained promises below by using .then().
        This handles the fulfilled and rejected states of the promise returned by the sendData async function */
        .then(retrieveData, error => {
          // This arrow callback function runs when the sendData async function returns a rejected promise with an error (side note, it runs the retrieveData async function above if sendData returns a resolved promise with a result)
          /* Appropriately handle any errors that might occur during the post (for example, when the Express server is not running or is inaccessible)
          Catches errors in both fetch() and response.json() in the sendData async function, as well as any other errors that might occur in the that function. */
          alert(`The following error occurred while sending data to the Express server:\n${error.message}`);
        })
          .catch(error => {
            // This arrow callback function runs when the retrieveData async function returns a rejected promise with an error (side note, for the receiveData async function, we are only interested in errors, hence the use of .catch() instead of .then() above)
            /* Appropriately handle any errors that might occur during the get (for example, when the Express server is not running or is inaccessible)
            Catches errors in both fetch() and response.json() in the retrieveData async function, as well as any other errors that might occur in the that function. */
            alert(`The following error occurred while retrieving data from the Express server:\n${error.message}`);
          });
  
    }, error => {
      // This arrow callback function runs when the getWeatherData async function returns a rejected promise with an error
      /* Appropriately handle any errors that might occur when fetching weather data (for example, when an Internet connection is not available).
      Catches errors in both fetch() and response.json() in the getWeatherData async function, as well as any other errors that might occur in that function. */
      alert(`The following error occurred while fetching weather data from OpenWeatherMap:\n${error.message}`);
    });
}

/*
Events
*/
// Listen for a click on the generate button
document.getElementById('generate').addEventListener('click', performActions);

/*
Global code
*/
// Nothing here