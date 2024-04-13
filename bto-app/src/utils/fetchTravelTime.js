import axios from "axios";

/**
 * A utility component to find the time taken to travel from start to end by various modes of transport
 *
 * @param {*} startLat - The starting latitude to geolocate from
 * @param {*} startLng - The starting longitude to geolocate from
 * @param {*} endLat - The ending destination latitude
 * @param {*} endLng - The ending destination longitude
 * @param {string} mode - The mode of transportation (e.g., 'car', 'pedestrian', "bicycle")
 * @returns {string} - The time taken to travel from start to end in hr and minutes
 */
export const fetchTravelTime = async (
  startLat,
  startLng,
  endLat,
  endLng,
  mode
) => {
  // Validate the mode parameter
  if (mode !== "car" && mode !== "pedestrian" && mode !== "bicycle") {
    throw new Error(
      'Invalid mode. The mode parameter must be either "car" or "pedestrian" or "bicycle.'
    );
  }

  try {
    const response = await axios.get(
      `https://router.hereapi.com/v8/routes?transportMode=${mode}&origin=${startLat},${startLng}&destination=${endLat},${endLng}&return=summary&apikey=ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI`
    );
    console.log(response.data);
    const totalSeconds = response.data.routes[0].sections.reduce(
      (total, section) => total + section.summary.duration,
      0
    );

    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let totalTimeTaken = "";
    if (hours > 0) {
      totalTimeTaken += `${hours} hr `;
    }
    if (minutes > 0) {
      totalTimeTaken += `${minutes} min`;
    }
    console.log("time taken is:", totalSeconds);
    return totalTimeTaken; // using this to be passed as seconds
  } catch (error) {
    return error;
  }
};
