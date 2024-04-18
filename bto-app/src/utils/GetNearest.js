import { getDistanceFromLatLonInKm } from "./GetDistanceFromLatLonInKm";

/**
 *
 * @param {GeoJSON} chosenJson - The amenity to get the nearest of from a coordinate
 * @param {object} data - An object containing latitude and longitude of the point to measure from
 * @returns {object} nearest - An object containing the amenity, distance and properties of it
 */

export function GetNearest(chosenJson, data) {
  var nearest = { obj: null, dist: null, properties: null };
  if (chosenJson) {
    return fetch(chosenJson)
      .then((response) => response.json())
      .then((dat) => {
        const newMarkers = dat.features
          .map((feature) => {
            
            const { coordinates } = feature.geometry;
            const [lng, lat] = coordinates; 
            return {
              geocode: [lat, lng],
              properties: feature.properties, 
            };
          })
          // Filter markers by distance
          .filter((marker) => {
            if (!data.latitude || !data.longitude) return true; // Show all if no home marker is set
            const distanceFromHome = getDistanceFromLatLonInKm(
              data.latitude,
              data.longitude,
              marker.geocode[0],
              marker.geocode[1]
            );
            if (distanceFromHome <= nearest.dist || nearest.dist == null) {
              nearest = {
                obj: marker,
                dist: distanceFromHome,
                properties: marker.properties,
              };
            }
          });
        return nearest; // Return the nearest marker
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        return 0; // Return 0 if there's an error
      });
  }
}
