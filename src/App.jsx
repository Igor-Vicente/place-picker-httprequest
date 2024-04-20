import { useRef, useState, useCallback, useEffect } from 'react';
import { log } from './log.js';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces, fetchUserPlaces } from './http.js';
import Error from './components/Error.jsx';

function App() {
  log('<App /> rendered');

  const selectedPlace = useRef();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
        setIsFetching(false);
      } catch (err) {
        setError({ message: err.message || 'Failed to fetch user places.' });
        setIsFetching(false);
      }
    };

    fetchPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  //in this component we are neither dealing with 'error state' nor 'isFetching state', instead we are updating the userPlaces immediately
  //and only after that we make a request to update the backend, but if the request fails we should set the userPlace as it was.
  async function handleSelectPlace(selectedPlace) {
    //updating the userPlaces state
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    //updating the backend to match the state of the application
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (err) {
      //If the backend update fails, we must return the application state (it works as a rollback)
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({ message: err.message || 'Failed to update places.' });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id),
      );

      try {
        updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id));
      } catch (err) {
        updateUserPlaces(userPlaces);
        setErrorUpdatingPlaces({ message: err.message || 'Failed to remove place.' });
      }

      setModalIsOpen(false);
    },
    [userPlaces],
  );

  const handleError = () => {
    setErrorUpdatingPlaces(null);
  };
  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
            isLoading={isFetching}
            loadingText="Fetching your places..."
          />
        )}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
