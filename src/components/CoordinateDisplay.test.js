import { render, screen } from '@testing-library/react';
import React from 'react';
import CoordinateDisplay from './CoordinateDisplay';

describe('CoordinateDisplay Component', () => {

  const mockLat = 52.452;
  const mockLon = 7.241;

  test('1. Renders the correct latitude and longitude values', () => {
    render(<CoordinateDisplay latitude={mockLat} longitude={mockLon} />);

    expect(screen.getByText(/Geklickte Koordinate/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByText(/Longitude/i)).toBeInTheDocument();

    expect(screen.getByText(/52\.452/i)).toBeInTheDocument(); 
    expect(screen.getByText(/7\.241/i)).toBeInTheDocument(); 
  });
  
  test('2. Renders gracefully with zero coordinates', () => {
    
    render(<CoordinateDisplay latitude={0} longitude={0} />);

    expect(screen.getByText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByText(/Longitude/i)).toBeInTheDocument();
    
    expect(screen.getAllByText(/0/)).toHaveLength(2); 
  });
});