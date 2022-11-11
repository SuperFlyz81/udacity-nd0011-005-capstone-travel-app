# Capstone Travel App PLACEHOLDER TITLEs

## Table of Contents
* [Overview](#overview)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Testing](#testing)
* [Browser compatibility](#browser-compatibility)
* [Development](#development)

## Overview
This is my fourth project in the Udacity front end web developer course. The project requirement was to evaluate the sentiment of an online news article (or any web page on the web) using natural language processing.

The goal of this project was to give us practice with:
  * Setting up Webpack.
  * Sass styles.
  * Webpack Loaders and Plugins.
  * Creating layouts and page design.
  * Service workers.
  * Using APIs and creating requests to external urls.

We were tasked with creating a client/server web app that uses the MeaningCloud Sentiment Analysis API to evaluate the text in any website address entered by the user. Our web app should then analyse the text in that website and determine if the sentiment of that text is strongly positive, positive, strongly negative, negative, or neutral. The app also evaluates if the subjectivity of the text is objective or subjective. And we also display a text snippet (the first 10 sentences) or the text that was evaluated.

Our web app uses the Webpack build tool to package our website for development and production purposes. Additionally, our web app uses Jest for JavaScript code testing purposes. And finally, we use service workers for offline website functionality.

[(Back to top)](#table-of-contents)

## Dependencies
* **Node.js**, or simply **Node**
  * a Server-side JavaScript runtime built on Chrome's V8 JavaScript engine.
  * Node includes the Node Package Manager (npm), which allows you to install Node packages and modules like Express, body-parser, and CORS from the macOS/Unix terminal or Windows command line.
  * https://nodejs.org
* **Express.js**, or simply **Express**
  * a Back-end web application framework for Node.js. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Basically, Express allows you to spin up a web server and then add additional features and middleware to that web server. Express also handles all HTTP routing (a.k.a. client requests) on our behalf.
  * https://expressjs.com
* **Webpack**
  * Webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset. It supports many loaders and plugins to allow you to, for example, transpile SASS (a CSS extension language) to CSS, minify your JavaScript, HTML, and style sheet files into smaller files for quicker website load times, create production and development specific website builds, and provide offline functionality to your website using service workers.
  * https://webpack.js.org
* **Other dependencies**
  * Please see the project's package.json, webpack.dev.js, and webpack.prod.js files for all other Node, Express, and Webpack dependencies that were used in this project. Details on most of these dependencies can be found be searching for the dependency package's name in the search bar at the Node Package Manager website at:
  * https://www.npmjs.com

[(Back to top)](#table-of-contents)

## Usage
* **Node.js**
  * Uninstall any pre-existing installations of Node.js:
    * This project and its dependencies were built and tested on Node version 16.18.0, the latest long term support (LTS) version of Node at the time this project was created. Subsequently you will need to install Node.js v16.18.0 on your Mac or PC before being able to use this project.
    * Subsequently, you might first need to uninstall the current version of Node.js that is installed on your Mac or PC before installing Node.js v16.18.0, which is required for this project.
    * To uninstall a prior/newer version of Node.js from your Mac that was previously installed using the Node.js Mac pkg installer, run the following two commands (taken from https://github.com/nodejs/node-v0.x-archive/issues/4058) in the macOS terminal:
      ```
      sudo rm -rf /usr/local/{bin/{node,npm},lib/node_modules/npm,lib/node,share/man/*/node.*}

      sudo rm -Rf /usr/local/lib/dtrace/node.d; sudo rm -Rf /usr/local/include/node
      ```
    Node uninstall instructions for Windows and Unix should be Googled, if required.
  * Install Node.js v16.18.0:
    * Next, download and install Node.js version 16.18.0 from the following link:
      https://nodejs.org/download/release/v16.18.0
      * For macOS, download and install the node-v16.18.0.pkg Mac installer file.
      * For Windows, download and install the node-v16.18.0-x64.msi Windows installer file.
      * For Unix, use the instructions at https://nodejs.org/en/download/package-manager to install Node.js for your particular Unix/Linux distro.
* **Clone repository from GitHub**
  * Next, clone (or download and extract) this project repository from GitHub to your local machine.
  * This can be done using the "git clone" command in the terminal or the "Code > Download ZIP" button on the GitHub website itself.
* **Install dependencies**
  * Then use the npm command from the Visual Studio Code terminal, macOS/Unix terminal, or Windows command line to install the project dependencies. A package.json file has been provided as part of this project, which can be used to install the all dependencies used by the project. This can be done by running the following command from the folder where you cloned/extracted the project files:
    ```
    npm install
    ```
  * Note that the dependency files installation can take a couple of minutes to complete.

* **Obtain a MeaningCloud Sentiment Analysis API key**
  * Register for a free MeaningCloud account at: https://www.meaningcloud.com/developer/create-account
  * Create a new file named ".env" in the root of your project folder.
  * Then copy your MeaningCloud license key from https://www.meaningcloud.com/developer/account/subscriptions
  into this new .env file in the following format:
    ```
    API_KEY=[Your_MeaningCloud_License_Key]

    For example:
    API_KEY=e2a4862b3df6086dd41b95da3b2a7520
    ```
  * Finally, save your .env file.
* **Launch the project**
  * We are now ready to launch the project. You can launch the project in production or development mode.
    * **Production mode**, which is optimized for performance (it runs on minified JavaScript and CSS files), can be built and launched as follows:
      * Run the following command in the Visual Studio Code terminal, macOS/Unix terminal, or Windows command line to build the production website (i.e., to create a dist subfolder with optimized/minimized web assets in it):
        ```
        npm run build
        ```
      * Then run the following command to spin up the Express web server:
        ```
        npm start
        ```
      * You can then open the production site in your browser at http://localhost:8081.

    * **Development mode**, which is optimized for readability (no minification of web assets) and live reloading (client-side code changes are visible immediately with no need to build a dist subfolder first), can be launched as follows:
      * Run the following command to spin up the Express web server (if you haven't already started it as part of the production mode launch process above):
        ```
        npm start
        ```
      * Then run the following command to start the Webpack live reloading development server and launch the development site:
        ```
        npm run dev
        ```
      * The development site is then accessible at http://localhost:8080 (a browser window with this URL should automatically be opened by the Webpack dev server when you run the "npm run build-dev" command above).
* **Sentiment Analysis**
  * You can now enter a URL on the Sentiment Analyser page and click the "Analyse" button to evaluate the sentiment of any article on the web.

[(Back to top)](#table-of-contents)

## Testing
Code testing is provided by the Jest JavaScript testing framework (https://jestjs.io). The Jest testing specification files can be found in the "\_\_test\_\_" subfolder in the root folder of the project. To test the various client-side JavaScript functions in this project, execute the Jest tests by running the following command in the Visual Studio Code terminal, macOS/Unix terminal, or Windows command line:
```
npm run test
```

## Browser compatibility
This web app was tested and should work fine with the following web browsers:

* Chrome
* Brave Browser
* Firefox
* Safari
* Microsoft Edge

**Internet Explorer is <u>not</u> supported since it is a legacy browser and is not compatible with many new CSS styles.**

[(Back to top)](#table-of-contents)

## Development
The entire web app was developed using the Visual Studio Code editor (https://code.visualstudio.com). And the responsive design of the website was tested using Google Chrome DevTools' Device Mode (https://developer.chrome.com/docs/devtools/device-mode). This should help ensure that the site displays correctly on various device sizes, including mobile phones, tablets, and computer monitors.

 The following HTML, CSS, and JavaScript style guide was used during development:
 * **Udacity frontend nanodegree style guide:** https://udacity.github.io/frontend-nanodegree-styleguide/index.html
 
 [(Back to top)](#table-of-contents)