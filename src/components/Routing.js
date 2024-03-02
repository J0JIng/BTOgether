import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import L from 'leaflet';

const Routing = ({ startLat, startLng, endLat, endLng, apiKey, mapRef }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const routeDrawnRef = useRef(false);
  const [routeData, setRouteData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://transit.router.hereapi.com/v8/routes`, {
          params: {
            apiKey: apiKey,
            origin: `${startLat},${startLng}`,
            destination: `${endLat},${endLng}`,
            return: 'intermediate'
          }
        });
        drawRoute(response.data.routes[0]);
        setRouteData(response.data.routes[0]);
        console.log(routeData)

      } catch (error) {
        setErrorMessage('Error fetching route data');
        console.error('Error fetching route data:', error);
      }
    };

    if (startLat && startLng && endLat && endLng) {
      fetchData();
    }
  }, [startLat, startLng, endLat, endLng, apiKey]);

  const drawRoute = (routeData) => {
    // Remove previous public transport polylines and markers
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline && layer.options.className === "publictransport") {
          mapRef.current.removeLayer(layer);
        }
      });
    }
  
    // Define color mapping for different transport modes and longNames
    const colorMapping = {
      "pedestrian": "darkblue",
      "bus": "#55DD33",
      "busRapid": "#55DD33",
      "subway": {
        "North South Line": "#D62821",
        "East West Line": "#189E4A",
        "North East Line": "#844184",
        "Circle Line": "#F2AD27",
        "Downtown Line": "#0354A6",
        "Thomson East Coast Line": "#9D5A25"
        // Add more longNames and corresponding colors as needed
      }
    };
  
    // Draw new polylines with colors based on transport mode and longName
    routeData.sections.forEach((section) => {
      const coordinates = [
        [section.departure.place.location.lat, section.departure.place.location.lng]
      ];

      // Add intermediate stops as points
      if (section.intermediateStops) {
        section.intermediateStops.forEach(stop => {
            //console.log(stop.departure.place.location.lat)
          coordinates.push([stop.departure.place.location.lat, stop.departure.place.location.lng]);
        });
      }
      
      coordinates.push([section.arrival.place.location.lat, section.arrival.place.location.lng]);
  
      const color =
        colorMapping[section.transport.mode] &&
        section.transport.mode === "subway" &&
        colorMapping[section.transport.mode][section.transport.longName]
          ? colorMapping[section.transport.mode][section.transport.longName]
          : colorMapping[section.transport.mode] || "#A8A8A8"; // Default color
  
      L.polyline(coordinates, { color: color, weight: 5, className: 'publictransport'}).addTo(mapRef.current);

      // Add markers for intermediate stops
      if (section.intermediateStops) {
        section.intermediateStops.forEach(stop => {
          L.marker([stop.departure.place.location.lat, stop.departure.place.location.lng]).addTo(mapRef.current);
        });
      }
    });
  
    // Fit map bounds to the new polylines
    const bounds = L.latLngBounds(routeData.sections.map(section => [
      section.departure.place.location.lat,
      section.departure.place.location.lng
    ]).concat(routeData.sections.map(section => [
      section.arrival.place.location.lat,
      section.arrival.place.location.lng
    ])));
    mapRef.current.fitBounds(bounds);
  
    routeDrawnRef.current = true;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
      {routeDrawnRef.current && (
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', padding: '2px' }}>
          <thead>
            <tr>
              <th colSpan="3" style={{ border: '1px solid black', padding: '2px' }}>Public Transport Route</th>
            </tr>
            <tr>
              <th style={{ border: '1px solid black', padding: '2px' }}>Waypoints</th>
              <th style={{ border: '1px solid black', padding: '2px' }}>Transport Mode</th>
              <th style={{ border: '1px solid black', padding: '2px' }}>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {routeData.sections.map((section, index) => {
              const departureTime = new Date(section.departure.time);
              const arrivalTime = new Date(section.arrival.time);
              const diff = arrivalTime - departureTime;
              const hours = Math.floor(diff / (1000 * 60 * 60)); // Convert milliseconds to hours
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
              let timeTaken = '';
              if (hours > 0) {
                timeTaken += `${hours} hr `;
              }
              timeTaken += `${minutes} min`;
              return (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '2px' }}>{section.arrival.place.name}</td>
                  <td style={{ border: '1px solid black', padding: '2px' }}>{section.transport.name || 'Walk'}</td>
                  <td style={{ border: '1px solid black', padding: '2px' }}>{timeTaken}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', border: '1px solid black', padding: '2px' }}>Total Time:</td>
              <td style={{ border: '1px solid black', padding: '2px' }}>
                {(() => {
                  const totalMilliseconds = routeData.sections.reduce((total, section) => {
                    const departureTime = new Date(section.departure.time);
                    const arrivalTime = new Date(section.arrival.time);
                    return total + (arrivalTime - departureTime);
                  }, 0);
                  const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
                  const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                  let totalTimeTaken = '';
                  if (totalHours > 0) {
                    totalTimeTaken += `${totalHours} hr `;
                  }
                  totalTimeTaken += `${totalMinutes} min`;
                  return totalTimeTaken;
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
  
  
};

export default Routing;
