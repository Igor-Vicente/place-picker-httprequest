import { useEffect, useState } from 'react';

export const useFetch = (fetchFunc, initialValue) => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await fetchFunc();
        setFetchedData(data);
      } catch (err) {
        setError({ message: err.message || 'Failed to fetch data.' });
      }

      setIsFetching(false);
    };

    fetchData();
  }, [fetchFunc]);

  return {
    isFetching,
    fetchedData,
    setFetchedData,
    error,
  };
};
