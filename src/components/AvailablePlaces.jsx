import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import { log } from '../log.js';

export default function AvailablePlaces({ onSelectPlace }) {
  log('<AvailablePlaces /> rendered', 1);

  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const resp = await fetch('http://localhost:3000/places');
      const respJson = await resp.json();
      setAvailablePlaces(respJson.places);
    };
    fetchPlaces();
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
