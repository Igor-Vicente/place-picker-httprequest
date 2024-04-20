import Places from './Places.jsx';
import { log } from '../log.js';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

const fetchSortedPlaces = async () => {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude,
      );
      resolve(sortedPlaces);
    });
  });
};

export default function AvailablePlaces({ onSelectPlace }) {
  log('<AvailablePlaces /> rendered', 1);

  //************calling the custom hook ****************/
  const { isFetching, fetchedData: availablePlaces, error } = useFetch(fetchSortedPlaces, []);
  //****************************************************/

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
