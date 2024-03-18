import React, { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from "leaflet";

// GeoJson Files
import gymgeojson from "../geojson/GymsSGGEOJSON.geojson";
import hawkergeojson from "../geojson/HawkerCentresGEOJSON.geojson";
import parksgeojson from "../geojson/Parks.geojson";
import preschoolgeojson from "../geojson/PreSchoolsLocation.geojson";
import clinicgeojson from "../geojson/CHASClinics.geojson";
import mallsgeojson from "../geojson/shopping_mall_coordinates.geojson";

// RoutingMachine for Car, Routing for Public transport
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

const GeojsonMapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const [homeLocation, setHomeLocation] = useState({ address: '', latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [distance, setDistance] = useState(5);
  const [chosenJson, setChosenJson] = useState('');
  const [mapStyle, setMapStyle] = useState('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}');
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
    if (chosenJson) {
      fetch(chosenJson)
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
    if (chosenJson === '') {
      setMarkerIcon(null);
      setMarkers([])
      setMapTitle("Singapore");
    } else if (chosenJson.includes("Gym")) {
      setMarkerIcon(gymIcon);
      setMapTitle("Gyms");
    } else if (chosenJson.includes("Hawker")) {
      setMarkerIcon(hawkerIcon);
      setMapTitle("Hawkers");
    } else if (chosenJson.includes("Park")) {
      setMarkerIcon(parkIcon);
      setMapTitle("Parks");
    } else if (chosenJson.includes("PreSchool")) {
      setMarkerIcon(preschoolIcon);
      setMapTitle("Preschools");
    } else if (chosenJson.includes("CHASClinic")) {
      setMarkerIcon(clincsIcon);
      setMapTitle("Clinics");
    } else if (chosenJson.includes("shopping_mall")) {
      setMarkerIcon(mallsIcon);
      setMapTitle("Malls");
    }
  }, [chosenJson,homeLocation,distance]);

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
          north: 1.5, south: 1.1, east: 104.1, west: 103.6
        };

        if (
          latitude >= singaporeBounds.south &&
          latitude <= singaporeBounds.north &&
          longitude >= singaporeBounds.west &&
          longitude <= singaporeBounds.east
        ) {
          setHomeLocation({
            address: homeLocation.address, latitude, longitude
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

  const toggleJson = () => {
    if (chosenJson === gymgeojson) {
      setChosenJson(hawkergeojson)
    } else if (chosenJson === hawkergeojson) {
      setChosenJson(parksgeojson) 
    } else if (chosenJson === parksgeojson) {
      setChosenJson(preschoolgeojson) 
    } else if (chosenJson === preschoolgeojson) {
      setChosenJson(clinicgeojson) 
    } else if (chosenJson === clinicgeojson) {
      setChosenJson(mallsgeojson) 
    } else if (chosenJson === mallsgeojson) {
      setChosenJson('') 
    } else {
      setChosenJson(gymgeojson)
    }
  }

  // Add a function to add a circle to the map
  const addCircleToMap = (map, center, radius) => {
    if (map && center) {
      return (
        <Circle center={center} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} radius={radius} />
      );
    }
  };

  // useEffect for radius circle
  useEffect(() => {
    if (mapRef.current && homeLocation.latitude && homeLocation.longitude) {
      const circle = addCircleToMap(mapRef.current, [homeLocation.latitude, homeLocation.longitude], distance*1000);
      if (circle) {
        const map = mapRef.current.leafletElement;
        if (map) {
          map.addLayer(circle);
        }
      }
    }
  }, [homeLocation]);

  const MapStylePanel = () => {
    const map = useMap();
    const [expanded, setExpanded] = useState(false);
  
    const controlStyle = {
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif',
      transition: 'width 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      width: expanded ? '330px' : '60px', // Initial width when collapsed and expanded width on hover
      height: expanded ? '150px' : '90px', // Initial width when collapsed and expanded width on hover
      overflow: 'hidden',
    };
  
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px', // Set height to match collapsed height
      cursor: 'pointer',
    };
  
    const imgStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      transition: 'opacity 0.3s ease', // Fade in/out effect
      opacity: expanded ? 0 : 1, // Hide image when expanded
    };
  
    const buttonContainerStyle = {
      display: 'flex',
      flexDirection: 'row', // Display buttons horizontally
      alignItems: 'center',
    };
  
    const buttonStyle = {
      backgroundColor: '#f8f9fa',
      border: '1px solid #d1d3d4',
      borderRadius: '3px',
      color: '#70757a',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '5px',
      padding: '8px 12px',
      textAlign: 'left',
      textDecoration: 'none',
      margin: '0 5px', // Add margin between buttons
    };
  
    const handleClick = (mapStyle) => {
      setExpanded(false); // Collapse the panel when clicked
      setMapStyle(mapStyle);
    };
  
    return (
      <div
        style={controlStyle}
        className="leaflet-bar leaflet-control"
        onMouseEnter={() => setExpanded(true)} // Expand on hover
        onMouseLeave={() => setExpanded(false)} // Collapse on mouse leave
      >
        <div style={containerStyle}>
          <img
            src="https://via.placeholder.com/40"
            alt="Map styles"
            style={imgStyle}
          />
          <span style={{ marginTop: '5px', opacity: expanded ? 0 : 1 }}>Styles</span>
          {expanded && (
            <div style={buttonContainerStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                <img src="https://via.placeholder.com/40" alt="Base Map" style={{ marginBottom: '5px' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}')} />
                <span onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}')}>Base Map</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                <img src="https://via.placeholder.com/40" alt="Base Map" style={{ marginBottom: '5px' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}')} />
                <span onClick={() => handleClick('https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}')}>Satellite Map</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                <img src="https://via.placeholder.com/40" alt="Base Map" style={{ marginBottom: '5px' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,transit&hl=en&x={x}&y={y}&z={z}')} />
                <span onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,transit&hl=en&x={x}&y={y}&z={z}')}>Transit Map</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                <img src="https://via.placeholder.com/40" alt="Base Map" style={{ marginBottom: '5px' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,traffic&hl=en&x={x}&y={y}&z={z}')} />
                <span onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,traffic&hl=en&x={x}&y={y}&z={z}')}>Traffic Map</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // This is the content for the Map
  return (
    <div>
      <h2 style={{marginBottom: 10}}>Map View of {mapTitle}</h2>

      {/* Distance slider*/}
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

      <LeafletMap center={mapCenter} zoom={11.5} ref={mapRef} style={{ height: '70vh', width: '1200px', border: '4px LightSteelBlue solid'}}>
        {/* Google Map Tile Layer */}
        <TileLayer
          attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url={mapStyle}
        />
        {/* Use url="https://mt1.google.com/vt/lyrs=m@221097413,transit&hl=en&x={x}&y={y}&z={z}" to show mrt lines */}
        
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

          <MapStylePanel />
        </LeafletMap>

      {/* This area is the form for the Map */}
      <h3 style={{ marginBottom: '5px'}}>Set Home Waypoint</h3>
      <label>Address: </label>
      <input type='text' placeholder="Enter Address here..." value={homeLocation.address} onChange={(e) => setHomeLocation({ ...homeLocation, address: e.target.value })}></input>
      {errorMessage && (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      )}
      <button onClick={handleGeocode}>Set Home</button>
      <button onClick={toggleJson}>Toggle GEOJson</button>

      {/* This is to show latitude and longtitude coords when available*/}
      {homeLocation.latitude && homeLocation.longitude && (
        <h4>Latitude: {homeLocation.latitude}, Longitude: {homeLocation.longitude}</h4>
      )}

      {/* This is for the public transport route, put at the end so routing table is at the bottom*/}
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
