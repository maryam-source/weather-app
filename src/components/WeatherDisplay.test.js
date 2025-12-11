import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import WeatherDisplay from './WeatherDisplay';

global.fetch = jest.fn();

const mockWeatherData = {
  city: 'Saarbrücken',
  country: 'DE',
  temperature: 15.5,
  description: 'leichter regen', 
  icon: '09d',
  humidity: 78,
  windSpeed: 5.1
};

const mockLat = 48.090;
const mockLon = 11.491;

describe('WeatherDisplay Component', () => {

  beforeEach(() => {
    const mockGeoResponse = {
      results: [{
        components: {
          city: mockWeatherData.city,
          country: mockWeatherData.country
        }
      }]
    };
    
    const mockWeatherResponse = {
      main: { 
          temp: mockWeatherData.temperature, 
          humidity: mockWeatherData.humidity 
      },
      weather: [{ 
          description: mockWeatherData.description, 
          icon: mockWeatherData.icon 
      }],
      wind: { 
          speed: mockWeatherData.windSpeed 
      }
    };
    
    fetch.mockImplementation((url) => {
      if (url.includes('opencagedata')) {
        return Promise.resolve({ json: () => Promise.resolve(mockGeoResponse) });
      }
      if (url.includes('openweathermap')) {
        return Promise.resolve({ json: () => Promise.resolve(mockWeatherResponse) });
      }
      return Promise.reject(new Error('Unexpected fetch call'));
    });
  });

  afterEach(() => {
    fetch.mockClear();
  });

  test('1. Renders loading state initially when coordinates are provided', () => {
    render(<WeatherDisplay latitude={mockLat} longitude={mockLon} />);
    expect(screen.getByText(/Lade Wetter- und Location-Daten.../i)).toBeInTheDocument();
  });

  test('2. Renders weather data correctly after API calls resolve', async () => {
    render(<WeatherDisplay latitude={mockLat} longitude={mockLon} />);

    const locationElement = await screen.findByText('Saarbrücken', { selector: 'h2', exact: false });

    expect(screen.queryByText(/Lade Wetter- und Location-Daten.../i)).not.toBeInTheDocument();

    expect(screen.getByText(/Wettervorhersage für/i)).toBeInTheDocument();
    expect(locationElement).toBeInTheDocument(); 

    expect(screen.getByText(/15\.5\s*°C/i)).toBeInTheDocument();

    expect(screen.getByText('leichter regen')).toBeInTheDocument(); 

    expect(screen.getByText('Luftfeuchtigkeit:')).toBeInTheDocument();
    expect(screen.getByText(/78\s*%/i)).toBeInTheDocument(); 

    expect(screen.getByText('Windgeschwindigkeit:')).toBeInTheDocument();
    expect(screen.getByText(/5\.1\s*m\/s/i)).toBeInTheDocument(); 
  });
});