# Weather Journal App Project

## Table of Contents
---
* [Overview](#overview)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Browser compatibility](#browser-compatibility)
* [Development](#development)

## Overview
---
This is my third project in the Udacity front end web developer course. This project is all about web APIs and asynchronous JavaScript applications. We were tasked with creating an asynchronous client/server web app that uses web API and user data to dynamically update the web app's user interface (UI).

At first glance, it might not look like this web app is doing much. But the real magic happens behind the scenes after the user has entered a United States ZIP code, how they feel today, and clicked the Generate button.

After the user has entered their information, the web app performs the following actions:
1. It retrieves today's weather data for the entered US ZIP code from the OpenWeatherMap web API.
2. It then stores that weather data, along with the user's data about how they are feeling today, on the web server side.
3. It then retrieves all the stored data from the server side (so the combined weather and user data).
4. And finally, it updates the web app's UI using the weather and user data received from the web server. This essentially creates a journal entry in our weather journal app. Please note that the date format in the UI is in American format, so m/d/yyyy.

[(Back to top)](#table-of-contents)

## Dependencies
---
* **Node.js**, or simply **Node**
  * a Server-side JavaScript runtime built on Chrome's V8 JavaScript engine.
  * Node includes the Node Package Manager (npm), which allows you to install Node packages and modules like Express, body-parser, and CORS from the macOS/Unix terminal or Windows command line.
  * https://nodejs.org
* **Express.js**, or simply **Express**
  * a Back-end web application framework for Node.js. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Basically, Express allows you to spin up a web server and then add additional features and middleware (e.g., body-parser and CORS) to that web server.
  * https://expressjs.com
* **body-parser**
  * a Node.js middleware package that provides body parsing capabilities, allowing you to parse incoming request bodies.
  * It provides the following parsers:
    * JSON body parser
    * Raw body parser
    * Text body parser
    * URL-encoded form body parser
  * https://www.npmjs.com/package/body-parser
* **CORS**
  * a Node.js middleware package for providing a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing (CORS) with various options.
  * https://www.npmjs.com/package/cors

[(Back to top)](#table-of-contents)

## Usage
---
Download and install Node.js. Then use the npm command from the Visual Studio Code terminal, macOS/Unix terminal, or Windows command line to install the Express, body-parser, and CORS Node packages. A package.json file has been provided as part of this project, which can be used to install the aforementioned dependencies. This can be done by running the following command from the location where you cloned/extracted the project files:
* npm install package.json

You can then run the following command from the Visual Studio Code terminal, macOS/Unix terminal, or Windows command line to spin up your Express web server:
* node server.js

If the Express web server starts successfully, you should receive the following message in the terminal/command line:
* Listening on port: 3000

You can then access and test the web app in your web browser at the following URL:
* http://localhost:3000

[(Back to top)](#table-of-contents)

## Browser compatibility
---
This web app was tested and should work fine with the following web browsers:

* Chrome
* Brave Browser
* Firefox
* Safari
* Microsoft Edge

**Internet Explorer is <u>not</u> supported since it is a legacy browser and is not compatible with many new CSS styles.**

[(Back to top)](#table-of-contents)

## Development
---
The entire web app was developed using the Visual Studio Code editor (https://code.visualstudio.com). And the responsive design of the website was tested using Google Chrome DevTools' Device Mode (https://developer.chrome.com/docs/devtools/device-mode). This should help ensure that the site displays correctly on various device sizes, including mobile phones, tablets, and computer monitors.

 The following HTML, CSS, and JavaScript style guide was used during development:
 * **Udacity frontend nanodegree style guide:** https://udacity.github.io/frontend-nanodegree-styleguide/index.html
 
 [(Back to top)](#table-of-contents)