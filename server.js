/*
Global variables
*/
let projectData = {}; // Empty JS object that acts as an API endpoint for all your Express server routes

/*
Express server setup
*/
// Express to run server and routes
const express = require('express');

// Start up an instance of the app
const app = express();

/*
Dependencies and middleware
*/
// Here we are configuring Express to use body-parser as middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross-origin allowance
const cors = require('cors');
app.use(cors());

/*
Global code
*/
// Initialize the main project folder
app.use(express.static('website'));

// Set the Express server port
const port = 3000;

// Spin up the Express server
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

// GET route - returns projectData API endpoint object's key/value pairs
app.get('/getdata', (request, response) => {
  response.send(projectData);
  // console.log('Got', projectData); // Debug code
});

// POST route - sets projectData API endpoint object's key/value pairs
app.post('/postdata', (request, response) => {
  const data = request.body;

  /* Use dot notation to add key/value pairs from our POST request's body to our endpoint object.
  See the following URL for details on object property accessors using dot/block notation:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors */
  projectData.temp = data.temp;
  projectData.date = data.date;
  projectData.feel = data.feel;

  /* IMPORTANT LINE BELOW - I originally forgot to send a response back from this post route.
  This lead to some crazy behaviour where my client-side post and get fetch API code would run fine for 6 times (a very obscure number of times),
  and then the Express server would just hang and not respond to any more post or get requests.
  Took a long time to debug, but finally realized that the issue occurred because I didn't send a response back from the post route.
  For more details, see the following post from someone who had a similar issue:
  https://stackoverflow.com/questions/55754725/express-not-accepting-post-requests-after-6-requests */
  response.send(projectData);
  // console.log('Posted', projectData); // Debug code
});