import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortConst = new AbortController();
    fetch(url, {signal:abortConst.signal})
    .then(res => {
    if (!res.ok) { 
        throw Error('ERROR: Could not fetch the data for that API resource');
    } 
    return res.json();
    })
    .then(data => {
        setIsPending(false);
        setData(data);
        setError(null);
    })
    .catch(err => {

    if(err.name === 'AbortError'){
        console.log('ERROR: Fetch aborted');
    }else{
        // auto catches network / connection error
        setIsPending(false);
        setError(err.message);
    }
    })
    return () => abortConst.abort();
  }, [url])

  return { data, isPending, error };
};
 
export default useFetch;