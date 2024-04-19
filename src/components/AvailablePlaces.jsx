import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import { log } from '../log.js';

export default function AvailablePlaces({ onSelectPlace }) {
  log('<AvailablePlaces /> rendered', 1);

  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/places')
      .then((resp) => resp.json())
      .then((resp) => setAvailablePlaces(resp.places));
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
