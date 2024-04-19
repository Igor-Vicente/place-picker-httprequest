export const fetchAvailablePlaces = async () => {
  const response = await fetch('http://localhost:3000/places');
  const data = await response.json();

  if (!response.ok) throw new Error('Failed to fetch places');

  return data.places;
};
