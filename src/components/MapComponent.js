import React, { useRef, useEffect } from 'react';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';

const WORLD_CITIES_URL =
  'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0';

const cityRenderer = new SimpleRenderer({
  symbol: {
    type: 'simple-marker',
    style: 'circle',
    color: '#0079FF',
    outline: {
      color: 'white',
      width: 0.5,
    },
  },
  visualVariables: [
  
    {
      type: 'size', 
      field: 'POP', 
      minDataValue: 1, 
      maxDataValue: 100000000, 
      minSize: 4, 
      maxSize: 20, 
    },
    
    {
      type: 'color', 
      field: 'POP',
      minDataValue: 1,
      maxDataValue: 100000000,
      colors: ['#00BFFF', '#0079FF', '#004F9A'],
    },
  ],
});

const citiesLayer = new FeatureLayer({
  url: WORLD_CITIES_URL,
  renderer: cityRenderer,
  title: 'World Cities (Population Classified)',
  opacity: 0.75,
  outFields: ['*'], 
});

/**
 * Functional Component using useRef and useEffect for Map integration.
 * @param {function} onMapClick 
 */
const MapComponent = ({ onMapClick }) => {
  const mapDiv = useRef(null); 

  useEffect(() => {
    let view;
    if (mapDiv.current) {
      const map = new Map({
        basemap: 'dark-gray-vector', 
      });

      map.add(citiesLayer);

      view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [7.241, 52.452], 
        zoom: 12,
      });

      view.on('click', (event) => {
        const lat = event.mapPoint.latitude.toFixed(3);
        const lon = event.mapPoint.longitude.toFixed(3);

        onMapClick({ latitude: lat, longitude: lon });
      });

      return () => {
        if (view) {
          view.destroy();
        }
      };
    }
  }, [onMapClick]);

  return <div className="map-container" ref={mapDiv}></div>;
};

export default MapComponent;