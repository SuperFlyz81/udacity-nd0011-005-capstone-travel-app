/*
Server server.js
*/

/*
Global variables
*/
const express = require('express');
const dotenv = require('dotenv');

let projectData = {}; // Empty JS object that acts as an API endpoint for all your Express server routes.

/*
Express server setup
*/
// Start up an instance of the app.
const app = express();

/*
Dependencies and middleware
*/
// Here we are configuring Express to use body-parser as middleware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross-origin allowance.
const cors = require('cors');
app.use(cors());

/*
Global code
*/
// Initialize the main project folder.
app.use(express.static('dist'));

// Set the Express server port.
const port = 8081;

// Spin up the Express server.
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

// Configure local environment variables (for API key retrieval from the local .env file that is never uploaded to GitHub).
dotenv.config();
// console.log(`Your API key is ${process.env.GEONAMES_API_USERNAME}`); // Debug code.

/*
Routes
*/
// GET route - returns the Webpack built client-side index.html file when the root of the website is requested.
app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
})

// GET route - returns the requested web API key.
app.get('/getapikey', (req, res) => {
  console.log(process.env.API_KEY);
  res.send(process.env.API_KEY);
})

// GET route - returns projectData API endpoint object's key/value pairs.
app.get('/getdata', (req, res) => {
  res.send(projectData);
  // console.log('Got', projectData); // Debug code.
});

// POST route - sets projectData API endpoint object's key/value pairs.
app.post('/postdata', (req, res) => {
  const data = req.body;

  // Use dot notation to add key/value pairs from our POST request's body to our endpoint object.
  projectData.temp = data.temp;
  projectData.date = data.date;
  projectData.feel = data.feel;

  res.send(projectData);
  // console.log('Posted', projectData); // Debug code.
});