import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const selectedPlaces = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const data = AVAILABLE_PLACES.filter((place) => selectedPlaces.includes(place.id));
console.log(data)
function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(data);
  const [avaiablePlaces, setAvaiablePlaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    console.log("hi")
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedData = sortPlacesByDistance(AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      )
      setAvaiablePlaces(sortedData)
      console.log(sortedData)
    });
  },[])

  function handleStartRemovePlace(id) {
    setIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const selectedPlaces = JSON.parse([localStorage.getItem("selectedPlaces")]) || [];
    if(selectedPlaces.indexOf(id) === -1){
      localStorage.setItem("selectedPlaces", JSON.stringify([id, ...selectedPlaces]))
      console.log(selectedPlaces)
    }
  }

  const removePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsOpen(false)
    const selectedPlaces = JSON.parse([localStorage.getItem("selectedPlaces")]) || [];
    localStorage.setItem("selectedPlaces", JSON.stringify(selectedPlaces.filter((id) => id !== selectedPlace.current)))
    console.log(selectedPlaces)

  }, []) 

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={removePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={avaiablePlaces}
          onSelectPlace={handleSelectPlace}
          fallbackText="please wait..."
        />
      </main>
    </>
  );
}

export default App;
