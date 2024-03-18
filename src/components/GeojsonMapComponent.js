import React, { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from "leaflet";

import RoutingMachine from "./routingMachine";
import Routing from "./Routing";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const GeojsonMapComponent = ({ filePath }) => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const [homeLocation, setHomeLocation] = useState({ address: '', latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [distance, setDistance] = useState(5); 
  const mapRef = useRef(null);

  // These are the icons for the map
  const gymIcon = new Icon({ iconUrl: require("../icons/gympin.png"), iconSize: [26, 26]});
  const hawkerIcon = new Icon({ iconUrl: require("../icons/hawkerpin.png"), iconSize: [26, 26]});
  const homeIcon = new Icon({ iconUrl: require("../icons/home-button.png"), iconSize: [26, 26]});
  const parkIcon = new Icon({ iconUrl: require("../icons/parks.png"), iconSize: [26, 24]});
  const preschoolIcon = new Icon({ iconUrl: require("../icons/preschools.png"), iconSize: [26, 26]});
  const clincsIcon = new Icon({ iconUrl: require("../icons/clinics.png"), iconSize: [26, 26]});
  const mallsIcon = new Icon({ iconUrl: require("../icons/malls.png"), iconSize: [26, 26]});

  // This is the API key for the public transport route using HERE
  const apiKey = 'ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI'; // HERE API key

  // This is to parse the GEOJson data
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
          })
          // Filter markers by distance
          .filter((marker) => {
            if (!homeLocation.latitude || !homeLocation.longitude) return true; // Show all if no home marker is set
            const distanceFromHome = getDistanceFromLatLonInKm(homeLocation.latitude, homeLocation.longitude, marker.geocode[0], marker.geocode[1]);
            return distanceFromHome <= distance;
          });
          setMarkers(newMarkers);
        })
        .catch((error) => console.error("Error fetching GeoJSON:", error));
    }
    if (filePath.includes("Gym")) {
      setMarkerIcon(gymIcon);
      setMapTitle("Gyms");
    } else if (filePath.includes("Hawker")) {
      setMarkerIcon(hawkerIcon);
      setMapTitle("Hawkers");
    } else if (filePath.includes("Park")) {
      setMarkerIcon(parkIcon);
      setMapTitle("Parks");
    } else if (filePath.includes("PreSchool")) {
      setMarkerIcon(preschoolIcon);
      setMapTitle("Preschools");
    } else if (filePath.includes("CHASClinic")) {
      setMarkerIcon(clincsIcon);
      setMapTitle("Clinics");
    } else if (filePath.includes("shopping_mall")) {
      setMarkerIcon(mallsIcon);
      setMapTitle("Malls");
    }
  }, [filePath,homeLocation,distance]);

  // This for dragging the destination marker
  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setHomeLocation(prevHomeLocation => ({
      ...prevHomeLocation,
      latitude: position.lat.toFixed(5),
      longitude: position.lng.toFixed(5)
    }));
  };

  // This is for the address field, to convert user input to latitude and longtitude
  const handleGeocode = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${homeLocation.address}&format=json&addressdetails=1&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);

        const singaporeBounds = {
          north: 1.47,
          south: 1.20,
          east: 104.05,
          west: 103.60
        };

        if (
          latitude >= singaporeBounds.south &&
          latitude <= singaporeBounds.north &&
          longitude >= singaporeBounds.west &&
          longitude <= singaporeBounds.east
        ) {
          setHomeLocation({
            address: homeLocation.address,
            latitude,
            longitude
          });
          setMapCenter([latitude, longitude]);
          setErrorMessage('');
        } else {
          setErrorMessage('The location is outside Singapore. Please refine your search.');
        }
      } else {
        setErrorMessage('Address not found');
      }
    } catch (error) {
      setErrorMessage('Error geocoding address');
      console.error('Error geocoding address:', error);
    }
  };

  // Add a function to add a circle to the map
  const addCircleToMap = (map, center, radius) => {
    if (map && center) {
      return (
        <Circle center={center} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} radius={radius} />
      );
    }
  };

  // Call the function within useEffect
  useEffect(() => {
    if (mapRef.current && homeLocation.latitude && homeLocation.longitude) {
      const circle = addCircleToMap(mapRef.current, [homeLocation.latitude, homeLocation.longitude], distance*1000); // Adjust radius as needed
      if (circle) {
        const map = mapRef.current.leafletElement; // Access the leafletElement property
        if (map) {
          map.addLayer(circle); // Add the circle to the map
        }
      }
    }
  }, [homeLocation]);

  // This is the content for the Map
  return (
    <div>
      <h2 style={{marginBottom: 10}}>Map View of {mapTitle}</h2>

      <div style={{marginBottom: '10px'}}>
      <label>Filter Distance (in km): </label>
      <input
        type="range"
        min="1"
        max="20"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />
      <span>{distance} km</span>
      </div>

      <LeafletMap center={mapCenter} zoom={11.5} ref={mapRef} style={{ height: '60vh', width: '1200px', border: '4px LightSteelBlue solid'}}>
        {/* Enable this Tile Layer for OpenStreetMap's Map */}
        {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}

        {/* Enable this Tile Layer for Google Map's Map */}
        <TileLayer
          attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        {/* This is for the driving route */}
        <RoutingMachine markerLat={homeLocation.latitude} markerLng={homeLocation.longitude} />
        
        {/* This are markers from the GEOJson data */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={markerIcon}>
            <Popup><div dangerouslySetInnerHTML={{ __html: filterHtmlContent(marker.popUp) }} /></Popup>
          </Marker>
        ))}

        {/* This is for the home marker */}
        {homeLocation.latitude && homeLocation.longitude && (
          <Marker position={[homeLocation.latitude, homeLocation.longitude]} icon={homeIcon} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
            {/* Popup for home marker */}
          </Marker>
        )}

        {/* This is for the amenities radius circle */}
        {homeLocation.latitude && homeLocation.longitude && (
          addCircleToMap(mapRef.current, [homeLocation.latitude, homeLocation.longitude], distance*1000) // Adjust radius as needed
        )}
        </LeafletMap>

      {/* This area is the form for the Map */}
      <h3 style={{ marginBottom: '5px'}}>Set Home Waypoint</h3>
      <label>Address: </label>
      <input type='text' placeholder="Enter Address here..." value={homeLocation.address} onChange={(e) => setHomeLocation({ ...homeLocation, address: e.target.value })}></input>
      {errorMessage && (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      )}
      <button onClick={handleGeocode}>Set Home</button>
      {homeLocation.latitude && homeLocation.longitude && (
        <h4>Latitude: {homeLocation.latitude}, Longitude: {homeLocation.longitude}</h4>
      )}

      {/* This is for the public transport route */}
      <Routing startLat={1.3455586} startLng={103.6817077} endLat={homeLocation.latitude} endLng={homeLocation.longitude} apiKey={apiKey} mapRef={mapRef} />
    
    </div>
  );
};

// This is to parse the GEOJson data to semi-readable format
const filterHtmlContent = (htmlContent) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;
  tempElement.querySelectorAll('th').forEach((thElement) => {
    const textContent = thElement.textContent.trim();
    const tdElement = thElement.nextElementSibling;
    if (!textContent || !tdElement || !tdElement.textContent.trim() || textContent === 'LANDYADDRESSPOINT'|| textContent === 'LANDXADDRESSPOINT'|| textContent === 'INC_CRC'|| textContent === 'FMEL_UPD_D' || textContent === 'PHOTOURL' || textContent === 'EST_ORIGINAL_COMPLETION_DATE' || textContent === 'ADDRESSBLOCKHOUSENUMBER') {
      thElement.parentNode.remove();
    }
  });
  return tempElement.innerHTML;
};

export default GeojsonMapComponent;
