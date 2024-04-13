import React, { useState, useEffect } from 'react';

const PEXELS_API_KEY = 'HLhZphBYMeRcerPCdf2PuQ7AvbQtLoOEsNNlP1oY02wNEeV4GClQm70O'; // Replace with your actual API key

export function ImageDisplay({ query }) {

  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);

  const getPhoto = async () => {
    console.log("query is:"+query);
    setLoading(true);
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=10`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      const data = await response.json();
      if (data.photos.length > 0) {
        // Randomly select an image from the top 10 results
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        setPhoto(data.photos[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhoto();
  }, []); // Fetch a new photo on initial render

  // Render the image or a loading indicator
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        photo && <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
      )}
    </div>
  );
}
