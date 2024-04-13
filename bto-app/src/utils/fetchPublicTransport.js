import axios from "axios";

/**
 * A utility component to find the time taken to travel from start to end by public transport
 *
 * @param {*} startLat - The starting latitude to geolocate from
 * @param {*} startLng - The starting longitude to geolocate from
 * @param {*} endLat - The ending destination latitude
 * @param {*} endLng - The ending destination longitude
 * @param {boolean} returnInSeconds - Flag to determine whether to return total time in seconds
 * @returns {string | number} - The time taken to travel from start to end by public transport in hr and minutes or seconds
 */
export const fetchPublicTransport = async (
  startLat,
  startLng,
  endLat,
  endLng,
  returnInSeconds = false
) => {
  try {
    const response = await axios.get(
      `https://transit.router.hereapi.com/v8/routes`,
      {
        params: {
          apiKey: "ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI",
          origin: `${startLat},${startLng}`,
          destination: `${endLat},${endLng}`,
          return: "intermediate",
        },
      }
    );

    const totalMilliseconds = response.data.routes[0].sections.reduce(
      (total, section) => {
        const departureTime = new Date(section.departure.time);
        const arrivalTime = new Date(section.arrival.time);
        return total + (arrivalTime - departureTime);
      },
      0
    );

    if (returnInSeconds) {
      const totalSeconds = Math.floor(totalMilliseconds / 1000);
      return totalSeconds;
    }

    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    let totalTimeTaken = "";
    if (totalHours > 0) {
      totalTimeTaken += `${totalHours} hr `;
    }
    totalTimeTaken += `${totalMinutes} min`;
    return totalTimeTaken;
  } catch (error) {
    console.error("Error fetching public transport data:", error);
    return error; // Return the error object
  }
};
