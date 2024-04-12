export const getAmenities = (chosenJson, data) => {

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  if (chosenJson) {
    return fetch(chosenJson)
      .then((response) => response.json())
      .then((dat) => {
        const newMarkers = dat.features
          .map((feature) => {
            const { Description } = feature.properties;
            const { coordinates } = feature.geometry;
            const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
            return {
              geocode: [lat, lng],
              popUp: Description, // Assuming Description contains HTML content
            };
          })
          // Filter markers by distance
          .filter((marker) => {
            if (!data.latitude || !data.longitude)
              return true; // Show all if no home marker is set
            const distanceFromHome = getDistanceFromLatLonInKm(
              data.latitude, data.longitude, marker.geocode[0], marker.geocode[1]);
            return distanceFromHome <= 1; // 1 for 1km
          });
        return newMarkers.length; // Return the count of newMarkers
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        return 0; // Return 0 if there's an error
      });
  }
};