import axios from "axios";

/**
 * A utility component to find the time taken to travel from start to end by public transport
 *
 * @param {*} startLat - The starting latitude to geolocate from
 * @param {*} startLng - The starting longitude to geolocate from
 * @param {*} endLat - The ending destination latitude
 * @param {*} endLng - The ending destination longitude
 * @returns {string} - The time taken to travel from start to end by public transport in hr and minutes
 */
export const fetchPublicTransport = async (
  startLat,
  startLng,
  endLat,
  endLng
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

    const totalSeconds = Math.floor(totalMilliseconds / 1000); // using this
    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    let totalTimeTaken = "";
    if (totalHours > 0) {
      totalTimeTaken += `${totalHours} hr `;
    }
    totalTimeTaken += `${totalMinutes} min`;

    console.log("time taken is:", totalSeconds);
    return totalTimeTaken; // using this to be passed as seconds
  } catch (error) {
    console.error("Error fetching public transport data:", error);
    return error; // Return the error object
  }
};
