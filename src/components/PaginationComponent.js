import React, { useState, useEffect } from 'react';

const PaginationComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/action/datastore_search?resource_id=d_11e68bba3b3c76733475a72d09759eeb&page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data.gov data');
        }
        const jsonData = await response.json();
        setData(prevData => [...prevData, ...jsonData.result.records]);
        setHasNextPage(!!jsonData.result._links.next);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (hasNextPage) {
      fetchData();
    }
  }, [currentPage, hasNextPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Data from data.gov.sg API:</h1>
      <ul>
        {data.map(item => (
          <li key={item._id}>{/* Render your data here */}</li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => setCurrentPage(prevPage => prevPage + 1)}>Load More</button>
      )}
    </div>
  );
};

export default PaginationComponent;
