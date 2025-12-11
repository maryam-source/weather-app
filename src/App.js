import '@arcgis/core/assets/esri/css/main.css'; 

import React, { useState, useCallback } from 'react'; 
import MapComponent from './components/MapComponent';
import CoordinateDisplay from './components/CoordinateDisplay';
import WeatherDisplay from './components/WeatherDisplay';
import './App.css'; 

function App() {
  const [coords, setCoords] = useState({
    latitude: 'N/A',
    longitude: 'N/A',
  });

  const handleMapClick = useCallback((newCoords) => {

    setCoords(newCoords);
  }, [setCoords]);

  return (
    <div className="app-container">
      <h1>Wetter-GIS-Anwendung (Teil 1 & 2)</h1>

      <div className="sidebar">
        {/* Coordinate Display component*/}
        <CoordinateDisplay
          latitude={coords.latitude}
          longitude={coords.longitude}
        />
        
        {/* Weather Display component*/}
        <WeatherDisplay
          latitude={coords.latitude}
          longitude={coords.longitude}
        />
      </div>

      <MapComponent onMapClick={handleMapClick} />
    </div>
  );
}

export default App;