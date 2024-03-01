import React, { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";
import axios from 'axios';

import RoutingMachine from "./routingMachine";

const GeojsonMapComponent = ({ filePath }) => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const [location, setLocation] = useState({ address: '', latitude: null, longitude: null });
  const mapRef = useRef();

  const gymIcon = new Icon({ iconUrl: require("../icons/gympin.png"), iconSize: [38, 38]});
  const hawkerIcon = new Icon({ iconUrl: require("../icons/hawkerpin.png"), iconSize: [38, 38]});
  const homeIcon = new Icon({ iconUrl: require("../icons/home-button.png"), iconSize: [38, 38]});

  // Fetch GeoJSON data and set markers and map title
  useEffect(() => {
    if (filePath) {
      fetch(filePath)
        .then((response) => response.json())
        .then((data) => {
          const newMarkers = data.features.map((feature) => {
            const { Description } = feature.properties;
            const { coordinates } = feature.geometry;
            const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
            return {
              geocode: [lat, lng],
              popUp: Description // Assuming Description contains HTML content
            };
          });
          setMarkers(newMarkers);
        })
        .catch((error) => console.error("Error fetching GeoJSON:", error));
    }
    if (filePath.includes("Gym")) {
      setMarkerIcon(gymIcon)
      setMapTitle("Gyms")
    } else {
      setMarkerIcon(hawkerIcon)
      setMapTitle("Hawkers")
    }
  }, [filePath, mapRef]);

  // Handle marker drag end event
  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setLocation(prevLocation => ({
      ...prevLocation,
      latitude: position.lat,
      longitude: position.lng
    }));
  };

  // Geocode address using Nominatim API
  const handleGeocode = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location.address}&format=json&addressdetails=1&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLocation({
          address: location.address,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        });
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        console.error('Address not found');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  return (
    <div>
      <h2 style={{marginBottom: 10}}>Map View of {mapTitle}</h2>
      <LeafletMap center={mapCenter} zoom={11.5} ref={mapRef} style={{ height: '70vh', width: '1200px', border: '4px LightSteelBlue solid'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine markerLat={location.latitude} markerLng={location.longitude} />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={markerIcon}>
            <Popup><div dangerouslySetInnerHTML={{ __html: filterHtmlContent(marker.popUp) }} /></Popup>
          </Marker>
        ))}
        {location.latitude && location.longitude && (
          <Marker position={[location.latitude, location.longitude]} icon={homeIcon} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
            {/* Popup for home marker */}
          </Marker>
        )}
      </LeafletMap>
      <h3 style={{ marginBottom: '5px'}}>Set Home Waypoint</h3>
      <label>Address: </label>
      <input type='text' value={location.address} onChange={(e) => setLocation({ ...location, address: e.target.value })}></input>
      <button onClick={handleGeocode}>Set Home</button>
      {location.latitude && location.longitude && (
        <h4>Latitude: {location.latitude}, Longitude: {location.longitude}</h4>
      )}
    </div>
  );
};

// Filter HTML content
const filterHtmlContent = (htmlContent) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;
  tempElement.querySelectorAll('th').forEach((thElement) => {
    const textContent = thElement.textContent.trim();
    const tdElement = thElement.nextElementSibling;
    if (!textContent || !tdElement || !tdElement.textContent.trim() || textContent === 'LANDYADDRESSPOINT'|| textContent === 'LANDXADDRESSPOINT'|| textContent === 'INC_CRC'|| textContent === 'FMEL_UPD_D') {
      thElement.parentNode.remove();
    }
  });
  return tempElement.innerHTML;
};

export default GeojsonMapComponent;
