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
  const [homeMarker, setHomeMarker] = useState([]);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const mapRef = useRef();

  const gymIcon = new Icon({ iconUrl: require("../icons/gympin.png"), iconSize: [38, 38]});
  const hawkerIcon = new Icon({ iconUrl: require("../icons/hawkerpin.png"), iconSize: [38, 38]});
  const homeIcon = new Icon({ iconUrl: require("../icons/home-button.png"), iconSize: [38, 38]});

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

  const popupStyle = {
    maxHeight: "100px",
    overflowY: "auto"
  };

  const updateHome = (coords, type) => {
    if (coords !== 0) {
      const parsedCoords = parseFloat(coords.trim());
      if (isNaN(parsedCoords)) {
        console.error("Invalid input: Please enter a valid number for latitude or longitude.");
        return;
      }
      return setHomeMarker(prevHomeMarker => {
        const updatedArray = [...prevHomeMarker];
        if (type === "lat") {
          updatedArray[0] = parsedCoords;
        } else {
          updatedArray[1] = parsedCoords;
        }
        return updatedArray;
      });
    }
  };

  const handleGeocode = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setHomeMarker([parseFloat(lat), parseFloat(lon)]);
      } else {
        console.error('Address not found');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const handleReverseGeocode = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
      if (response.data.address) {
        setAddress(response.data.address);
      } else {
        console.error('Coordinates not found');
      }
    } catch (error) {
      console.error('Error reverse geocoding coordinates:', error);
    }
  };

  return (
    <div>
      <h2 style={{marginBottom: 10}}>Map View of {mapTitle}</h2>
      <LeafletMap center={[1.354, 103.825]} zoom={11.5} ref={mapRef} style={{ height: '70vh', width: '1200px', border: '4px LightSteelBlue solid'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine markerLat={homeMarker[0]} markerLng={homeMarker[1]} />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={markerIcon}>
            <Popup style={popupStyle}>
              <div dangerouslySetInnerHTML={{ __html: filterHtmlContent(marker.popUp) }} />
            </Popup>
          </Marker>
        ))}
        {homeMarker[0] && homeMarker[1] && (
          <Marker position={homeMarker} icon={homeIcon}>
            <Popup><h3>Home</h3></Popup>
          </Marker>
        )}
      </LeafletMap>
      <h3 style={{ marginBottom: '5px'}}>Set Home Waypoint</h3>
      <label>Address: </label>
      <input type='text' value={address} onChange={(e) => setAddress(e.target.value)}></input>
      <button onClick={handleGeocode}>Geocode</button>
      <button onClick={handleReverseGeocode}>Reverse Geocode</button>
      <label>Latitude: </label>
      <input type='text' value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))}></input>
      <label>Longitude: </label>
      <input type='text' value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))}></input>
      <button onClick={() => setHomeMarker([latitude, longitude])}>Set Home Marker</button>
    </div>
  );
};

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
