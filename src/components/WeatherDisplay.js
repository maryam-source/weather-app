import React, { useState, useEffect } from 'react';

const OPENCAGE_KEY = process.env.REACT_APP_OPENCAGE_KEY;
const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

/**
 * Component to fetch and display location name (Reverse Geocoding) 
 * and weather forecast from external services.
 * @param {string} latitude 
 * @param {string} longitude 
 */
const WeatherDisplay = ({ latitude, longitude }) => {
  const [locationName, setLocationName] = useState('...');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (latitude === 'N/A') {
        return; 
    }

    if (!OPENCAGE_KEY || !OPENWEATHER_KEY) {
        setError('API Keys fehlen. Bitte prüfen Sie Ihre .env Datei und starten Sie neu!');
        return;
    }

    setLoading(true);
    setWeatherData(null);
    setError(null);

    const fetchLocationAndWeather = async () => {
      try {

        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_KEY}&limit=1&pretty=1&no_annotations=1`;
        const geoResponse = await fetch(geoUrl, { signal }); 
        const geoJson = await geoResponse.json();

        let name = 'Unbekannte Location';
        if (geoJson.results && geoJson.results.length > 0) {
          const result = geoJson.results[0].components;
          name = result.city || result.town || result.village || result.country || 'Unbekannte Location';
        } 
        setLocationName(name);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric&lang=de`;
        const weatherResponse = await fetch(weatherUrl, { signal });
        const weatherJson = await weatherResponse.json();

        if (weatherJson.main) {
          setWeatherData({
            temp: weatherJson.main.temp.toFixed(1), 
            description: weatherJson.weather[0].description,
            icon: weatherJson.weather[0].icon, 
            humidity: weatherJson.main.humidity,
            wind: weatherJson.wind.speed.toFixed(1),
          });
        } else {
          setError(`Wetterfehler: ${weatherJson.message || 'Daten nicht verfügbar.'}`);
        }
      } catch (err) {

        if (err.name !== 'AbortError') { 
          console.error('API Fetch Error:', err);
          setError(`Fehler beim Abrufen der Daten: ${err.message}`);
        }
      } finally {

        if (!signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchLocationAndWeather();

    return () => {
      controller.abort();
    };

  }, [latitude, longitude]); 


  if (error) {
    return (
      <div className="weather-display error">
        <h2>Fehler</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-display loading">
        <h2>Wetterinformationen</h2>
        <p>Lade Wetter- und Location-Daten...</p>
      </div>
    );
  }

  return (
    <div className="weather-display">
      <h2>Wettervorhersage für &lt;{locationName}&gt;</h2>
      
      {weatherData ? (
        <div className="weather-display__data">
          <div className="weather-display__current">
            {/* OpenWeatherMap icon URL pattern */}
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
              alt={weatherData.description} 
              className="weather-display__icon"
            />
            <p className="weather-display__temp">{weatherData.temp}°C</p>
          </div>
          <p className="weather-display__description">
            {weatherData.description}
          </p>
          <ul className="weather-display__details">
            <li>
              <span className="weather-display__label">Luftfeuchtigkeit:</span>
              <span className="weather-display__value">{weatherData.humidity}%</span>
            </li>
            <li>
              <span className="weather-display__label">Windgeschwindigkeit:</span>
              <span className="weather-display__value">{weatherData.wind} m/s</span>
            </li>
          </ul>
        </div>
      ) : (
        <p className="weather-display__initial-prompt">Klicken Sie auf die Karte, um die Wetterdaten abzurufen.</p>
      )}
    </div>
  );
};

export default WeatherDisplay;