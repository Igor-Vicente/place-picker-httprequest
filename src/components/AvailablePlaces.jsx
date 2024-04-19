import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import { log } from '../log.js';
import Error from './Error.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  log('<AvailablePlaces /> rendered', 1);
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);
      try {
        const resp = await fetch('http://localhost:3000/places');
        const respJson = await resp.json();
        if (!resp.ok) throw new Error('Failed to fetch places');
        setAvailablePlaces(respJson.places);
      } catch (err) {
        setError({ message: err.message || 'Could not fetch places, please try again later.' });
      }
      setIsFetching(false);
    };

    fetchPlaces();
  }, []);

  if (error) {
    return (
      <Error
        title="An error occurred!"
        message={error.message}
        onConfirm={() => console.log('err')}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
