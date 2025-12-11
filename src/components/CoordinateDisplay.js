import React from 'react';

const CoordinateDisplay = ({ latitude, longitude }) => {
  return (
    <div className="coordinate-display">
      <h2 className="coordinate-display__title">Geklickte Koordinaten</h2>
      <p>
        <span className="coordinate-display__label">Latitude (Breite):</span>
        <span className="coordinate-display__value">{latitude}</span>
      </p>
      <p>
        <span className="coordinate-display__label">Longitude (Länge):</span>
        <span className="coordinate-display__value">{longitude}</span>
      </p>
    </div>
  );
};

export default CoordinateDisplay;