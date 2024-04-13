import axios from 'axios';

/**
 * A utility component to find the time taken to travel from start to end by car
 * 
 * @param {*} startLat - The starting latitude to geolocate from
 * @param {*} startLng - The starting longitude to geolocate from
 * @param {*} endLat - The ending destination latitude
 * @param {*} endLng - The ending destination longitude
 * @returns {string} - The time taken to travel from start to end by car in hr and minutes
 */

export const fetchTransport = async (startLat, startLng, endLat, endLng) => {
    console.log(startLat, startLng, endLat, endLng)
  try {
    const response = await axios.get(
      `https://router.hereapi.com/v8/routes?transportMode=car&origin=${startLat},${startLng}&destination=${endLat},${endLng}&return=summary&apikey=ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI`
    );
    console.log(response.data.routes[0])
    const totalSeconds = response.data.routes[0].sections.reduce(
      (total, section) => total + section.summary.duration,
      0
    );
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let totalTimeTaken = '';
    if (hours > 0) {
      totalTimeTaken += `${hours} hr `;
    }
    if (minutes > 0) {
      totalTimeTaken += `${minutes} min`;
    }
    return totalTimeTaken
  } catch (error) {
    return error
  }
};
