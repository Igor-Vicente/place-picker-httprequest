import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import { log } from '../log.js';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  log('<AvailablePlaces /> rendered', 1);
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:3000/places');
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch places');
        //we can't use async/await with getCurrentPosition because it doesn't deliver a promise, but this is an asyncronous method that will execute
        //the function (that we define inside) after it gets the current position.
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            data.places,
            position.coords.latitude,
            position.coords.longitude,
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (err) {
        setError({ message: err.message || 'Could not fetch places, please try again later.' });
        setIsFetching(false);
      }
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
