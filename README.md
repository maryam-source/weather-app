# Geo Weather Dashboard (`weather-app`)

This project implements a single-page web-GIS application that combines geospatial visualisation with external weather and geocoding services. It is built using React (Functional Components and Hooks) and the ArcGIS Maps SDK for JavaScript.

The solution adheres to all four parts of the technical assignment, focusing on modularity, production readiness, and robust unit testing.


## 1. Project Setup and Quick Start

### System Prerequisites

To run and build this project, standard web development tools are required:

* Node.js: Version 18+ (LTS recommended)
* npm (Node Package Manager)
* Browser: Chrome 

### Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  Configure API Keys: For security, API keys are stored as environment variables. Create a file named `.env` in the project root and add the following:
    ```
    REACT_APP_OPENCAGE_KEY=[YOUR_OPENCAGE_KEY]

    REACT_APP_OPENWEATHER_KEY=[YOUR_OPENWEATHER_KEY]
    ```

3.  Start the Application (Development Mode):
    ```bash
    npm start
    ```
    The application will launch at `http://localhost:3000`.


## 2. Application Architecture

### Part 1: Web-GIS-Basisanwendung

The map functionality is encapsulated within the `MapComponent.js`, adhering to the following requirements:

* Basemap: The map is initialised using the `dark-grey-vector` Basemap.
* Operational Layer: The required `World_Cities` Feature Service is integrated.
* Data Visualisation: A `SimpleRenderer` is leveraged with `VisualVariables`.
* This ensures that the size of the city markers is dynamically scaled based on the `POP`(Population) attribute, providing clear visual density.
* Coordinate Capture: A click handler captures the exact WGS84 Decimal Degree coordinate (`event.mapPoint`) and displays it in the separate `CoordinateDisplay.js` component.

### Part 2: Integration of External Web Services

The `WeatherDisplay.js` component handles the data flow for location and weather information using robust asynchronous logic:

1.  Reverse Geocoding: The clicked map coordinate is first sent to the OpenCage Geocoder. This retrieves the human-readable location name (city/town/country).
2.  Weather Forecast: The obtained location name is then used to query the OpenWeatherMap service for current conditions and forecast data.


## 3. Build Tools and Deployment

To produce an optimised build ready for deployment, the standard Create React App tools are utilised, but with a necessary adjustment for large dependencies.

### Build Configuration and Execution

| Optimized Build | Custom `build` script in `package.json`: <br> `node --max_old_space_size=4096 node_modules/react-scripts/scripts/build.js` | This is a production necessity. It explicitly allocates 4GB of memory to the Node process, which prevents the build from failing due to common "JavaScript heap out of memory" errors when bundling large libraries like the ArcGIS Maps SDK.
| API Security | Keys accessed via `process.env.REACT_APP_...` | Guarantees that sensitive credentials are not hardcoded into the final deployment artifacts. |

**To generate the optimised build:**
```bash
npm run build
