import React, { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from "leaflet";
import { getFirestore, collection, updateDoc, addDoc, getDocs } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { auth } from '../utils/firebase';

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

import traffic from "../icons/traffic.png"
import transit from "../icons/transit.png"
import satellite from "../icons/satellite.png"
import base from "../icons/base.png"

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

const GeojsonMapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const [homeLocation, setHomeLocation] = useState({ address: '', latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [distance, setDistance] = useState(1);
  const [chosenJson, setChosenJson] = useState('');
  const [mapStyle, setMapStyle] = useState('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}');
  const [currentSource, setCurrentSource] = useState(satellite)
  const [routingLocation, setRoutingLocation] = useState({ latitude: null, longitude: null });
  const [addressField, setAddressField] = useState('');
  const mapRef = useRef(null);
  const iconSize = 36;

  // These are the icons for the map
  const gymIcon = new Icon({ iconUrl: require("../icons/gympin.png"), iconSize: [iconSize, iconSize] });
  const hawkerIcon = new Icon({ iconUrl: require("../icons/hawkerpin.png"), iconSize: [iconSize, iconSize] });
  const homeIcon = new Icon({ iconUrl: require("../icons/home-button.png"), iconSize: [iconSize, iconSize] });
  const parkIcon = new Icon({ iconUrl: require("../icons/parks.png"), iconSize: [iconSize, iconSize] });
  const preschoolIcon = new Icon({ iconUrl: require("../icons/preschools.png"), iconSize: [iconSize, iconSize] });
  const clincsIcon = new Icon({ iconUrl: require("../icons/clinics.png"), iconSize: [iconSize, iconSize] });
  const mallsIcon = new Icon({ iconUrl: require("../icons/malls.png"), iconSize: [iconSize, iconSize] });

  // This is the API key for the public transport route using HERE
  const apiKey = 'ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI'; // HERE API key

  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');

  const setHome = () => {
    let homeLayerExists = false; // Flag to track if the 'home' layer exists

    mapRef.current.eachLayer((layer) => {
      if (layer.options.layerName === "home") {
        homeLayerExists = true; // Set flag to true if 'home' layer is found
      }
    });

    if (homeLayerExists) {
      // Home pin is on map, proceed to set home
      const q = query(colRef, where("email", "==", auth.currentUser.email));

      getDocs(q)
        .then((snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0].ref;
            updateDoc(doc, {
              homeAddress: homeLocation.address,
              homeLatitude: homeLocation.latitude,
              homeLongitude: homeLocation.longitude
            })
              .then(() => { console.log("Updated Home Location!"); })
              .catch((error) => { console.error("Error updating document:", error); });
          } else {
            console.log("Creating document for user");
            addDoc(colRef, {
              email: auth.currentUser.email // Accessing email property
            })
              .then((docRef) => {
                updateDoc(docRef, {
                  homeAddress: homeLocation.address,
                  homeLatitude: homeLocation.latitude,
                  homeLongitude: homeLocation.longitude
                })
                  .then(() => { console.log("Saved Home Location!"); })
                  .catch((error) => { console.error("Error updating document:", error); });
              })
              .catch((error) => { console.error("Error adding document:", error); });
          }
        })
        .catch((error) => { console.error("Error fetching document:", error); });
    } else {
      alert("Click 'Find Home' to Place a Pin");
    }
  };



  // Load Home
  const loadHome = () => {
    const q = query(colRef, where("email", "==", auth.currentUser.email));

    getDocs(q)
      .then((snapshot) => {
        // Check if a document exists
        if (snapshot.empty) { alert("No document found with provided email"); return; }
        // Get the document reference from the first snapshot
        const docData = snapshot.docs[0].data();
        // Update the document
        const homeAddress = docData.homeAddress;
        const homeLatitude = docData.homeLatitude;
        const homeLongitude = docData.homeLongitude;
        if (homeLatitude && homeLongitude) {
          setHomeLocation({
            address: homeAddress, latitude: homeLatitude, longitude: homeLongitude
          });
          setErrorMessage('');
          setDistance(1)
          flyToCoords(homeLatitude, homeLongitude);
        } else {
          console.log("No home location saved")
        }
      })
      .catch((error) => { console.error("Error fetching documents:", error); });
  };

  // WIP
  const clearMap = () => {
    mapRef.current.eachLayer((layer) => {
      if (layer.options.layerName !== "mapLayer") {
        mapRef.current.removeLayer(layer);
      }
    });
    setRoutingLocation({ latitude: null, longitude: null })
    setHomeLocation({ address: '', latitude: null, longitude: null });
    setChosenJson('')
    setMapCenter(1.354, 103.825);
    mapRef.current.flyTo([1.354, 103.825], 12, {
      animate: true,
      duration: 1 // in seconds
    });
    setErrorMessage('');
  };

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
  }, [chosenJson, homeLocation, distance]);

  // This for dragging the destination marker
  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    handleReverseGeocode(position.lat.toFixed(5), position.lng.toFixed(5))
    setHomeLocation(prevHomeLocation => ({
      ...prevHomeLocation,
      latitude: position.lat.toFixed(5),
      longitude: position.lng.toFixed(5)
    }));
    flyToCoords(position.lat.toFixed(5), position.lng.toFixed(5))
  };

  // This is for the address field, to convert user input to latitude and longitude
  const handleGeocode = async () => {
    if (addressField === null || addressField === '') {
      alert("Type in an Address")
      return
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${addressField}&format=json&addressdetails=1&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road = response.data[0].address.road ? response.data[0].address.road : response.data[0].address.suburb;

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
            address: road, latitude: latitude, longitude: longitude
          });
          setErrorMessage('');
          // Fly to the location
          flyToCoords(latitude, longitude);
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

  const flyToCoords = (lat, long) => {
    if (mapRef.current && lat && long) {
      mapRef.current.flyTo([lat, long], 17, {
        animate: true,
        duration: 1 // in seconds
      });
    }
  };

  const handleReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
      if (response.data) {
        const road = response.data.address.road ? response.data.address.road : response.data.address.suburb;
        setHomeLocation({
          address: road,
          latitude: latitude,
          longitude: longitude
        });
        setMapCenter([latitude, longitude]);
        setErrorMessage('');
      } else {
        setErrorMessage('Address not found');
      }
    } catch (error) {
      setErrorMessage('Error reverse geocoding address');
      console.error('Error reverse geocoding address:', error);
    }
  };

  const toggleJson = () => {
    setRoutingLocation({ latitude: null, longitude: null })
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
        <Circle center={center} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} radius={radius} layerName="circle" />
      );
    }
  };

  // useEffect for radius circle
  useEffect(() => {
    if (mapRef.current && homeLocation.latitude && homeLocation.longitude) {
      const circle = addCircleToMap(mapRef.current, [homeLocation.latitude, homeLocation.longitude], distance * 1000);
      if (circle) {
        const map = mapRef.current.leafletElement;
        if (map) {
          map.addLayer(circle);
        }
      }
    }
  }, [homeLocation]);

  const MapStylePanel = () => {
    const [expanded, setExpanded] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null); // To store the timeout ID
    const [hoveringOverSide, setHoveringOverSide] = useState(false)

    const iconSize = '50px';

    const mainPanelStyle = {
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      width: '70px',
      height: '90px',
    };

    const sidePanelStyle = {
      position: 'absolute',
      display: 'flex',
      zIndex: 1000,
      flexDirection: 'row',
      justifyContent: 'right',
      alignItems: 'center',
      bottom: '10px',
      left: '90px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      width: '290px',
      height: '90px',
      cursor: 'pointer',
      transition: 'opacity 0.3s ease', // Add transition for smooth hiding
      opacity: expanded ? 1 : 0, // Hide when not expanded
    };

    const handleClick = (mapStyle, type) => {
      setExpanded(false); // Collapse the panel when clicked
      clearTimeout(timeoutId); // Clear any existing timeout
      setMapStyle(mapStyle);
      setHoveringOverSide(false);

      if (type === 'base') {
        setCurrentSource(satellite)
      } else if (type === 'satellite') {
        setCurrentSource(base)
      } else if (type === 'traffic') {
        setCurrentSource(traffic)
      } else if (type === 'transit') {
        setCurrentSource(transit)
      }
    };

    const handleMainPanelHover = () => {
      clearTimeout(timeoutId); // Clear any existing timeout
      setExpanded(true); // Always expand when hovering over the main panel
    };

    const handleMainPanelLeave = () => {
      clearTimeout(timeoutId); // Clear any existing timeout
      // Set a new timeout to hide the side panel after 3 seconds
      setTimeoutId(
        setTimeout(() => {
          if (hoveringOverSide === false) {
            setExpanded(false);
          }
        }, 1000)
      );
    };

    const handleSidePanelHover = () => {
      clearTimeout(timeoutId); // Clear any existing timeout
      setExpanded(true);
      setHoveringOverSide(true);
    };

    const handleSidePanelLeave = () => {
      setHoveringOverSide(false);
      setExpanded(false);
    };

    return (
      <div>
        <div
          style={mainPanelStyle}
          className="leaflet-bar leaflet-control"
          onMouseEnter={handleMainPanelHover}
          onMouseLeave={handleMainPanelLeave}
        >
          <img
            src={currentSource}
            alt="Base Map"
            style={{ marginTop: '10px', width: iconSize, height: iconSize, border: "2px solid LightSteelBlue", borderRadius: '5px' }}
            onClick={() =>
              handleClick('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}')
            }
          />
          <span>Layers</span>
        </div>

        {expanded && (
          <div
            style={sidePanelStyle}
            className="leaflet-bar leaflet-control"
            onMouseEnter={handleSidePanelHover}
            onMouseLeave={handleSidePanelLeave} // Still hide when leaving the side panel
          >
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px', alignItems: 'center' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', 'base')}>
              <img src={base} alt="Base Map" style={{ marginTop: '5px', marginBottom: '5px', width: iconSize, height: iconSize, border: "2px solid LightSteelBlue", borderRadius: '5px' }} />
              <span>Base</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px', alignItems: 'center' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', 'satellite')}>
              <img src={satellite} alt="Base Map" style={{ marginTop: '5px', marginBottom: '5px', width: iconSize, height: iconSize, border: "2px solid LightSteelBlue", borderRadius: '5px' }} />
              <span>Satellite</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px', alignItems: 'center' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,transit&hl=en&x={x}&y={y}&z={z}', 'transit')}>
              <img src={transit} alt="Base Map" style={{ marginTop: '5px', marginBottom: '5px', width: iconSize, height: iconSize, border: "2px solid LightSteelBlue", borderRadius: '5px' }} />
              <span>Transit</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px', alignItems: 'center' }} onClick={() => handleClick('https://mt1.google.com/vt/lyrs=m@221097413,traffic&hl=en&x={x}&y={y}&z={z}', 'traffic')}>
              <img src={traffic} alt="Base Map" style={{ marginTop: '5px', marginBottom: '5px', width: iconSize, height: iconSize, border: "2px solid LightSteelBlue", borderRadius: '5px' }} />
              <span>Traffic</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const routeHere = (coords) => {
    setRoutingLocation({ latitude: coords[0], longitude: coords[1] })
    mapRef.current.closePopup();
  };

  // Function to parse HTML content and extract attribute values
  const extractNameFromHtml = (htmlContent) => {
    const tableRegex = /<(table|tr|th|td)\b[^>]*>/i;
    if (tableRegex.test(htmlContent.popUp) === true) {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlContent.popUp;
      const thElements = tempElement.querySelectorAll('th');
      let nameElement = null;
      thElements.forEach(th => {
        if (th.textContent.trim() === 'NAME' || th.textContent.trim() === 'CENTRE_NAME' || th.textContent.trim() === 'HCI_NAME') {
          nameElement = th;
        }
      });
      if (nameElement) {
        const tdElement = nameElement.nextElementSibling;
        if (tdElement) { return tdElement.textContent.trim(); }
      }
      return ''; // Return an empty string if "NAME" is not found
    } else { return htmlContent.popUp }
  };

  // This is the content for the Map
  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Map View of {mapTitle}</h2>

      {/* Distance slider*/}
      <div style={{ marginBottom: '10px' }}>
        <label>Filter Distance (in km): </label>
        <input
          type="range"
          min="0"
          max="20"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <span>{distance} km</span>
      </div>

      <div style={{ display: 'flex' }}>
        {/* This is for the public transport route, put at the end so routing table is at the bottom*/}
        <div style={{ flex: 1, padding: '10px' }}>
          {/* Table of Markers */}
          {markers.length > 0 && (
              <div style={{ display: 'inline-block', maxWidth: '100%', marginBottom: '20px', marginTop: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', padding: '2px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '2px' }}>{markers.length} {mapTitle} in {distance}km Radius: </th>
                    </tr>
                  </thead>
                  <tbody>
                    {markers.map((marker, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '5px' }}>{extractNameFromHtml(marker)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          {/* Public Transport Table */}
          <Routing startLat={homeLocation.latitude} startLng={homeLocation.longitude} endLat={routingLocation.latitude} endLng={routingLocation.longitude} apiKey={apiKey} mapRef={mapRef} />
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <LeafletMap center={mapCenter} zoom={11.5} ref={mapRef} style={{ height: '70vh', width: '1200px', border: '4px LightSteelBlue solid' }}>
            {/* Google Map Tile Layer */}
            <TileLayer
              attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url={mapStyle}
              layerName='mapLayer'
            />

            {/* This is for the driving route */}
            <RoutingMachine start={homeLocation} markerLat={routingLocation.latitude} markerLng={routingLocation.longitude} />

            {/* This are markers from the GEOJson data */}
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.geocode} icon={markerIcon}>
                <Popup><div dangerouslySetInnerHTML={{ __html: filterHtmlContent(marker.popUp) }} /><button onClick={() => routeHere(marker.geocode)}>Get Directions</button></Popup>
              </Marker>
            ))}

            {/* This is for the home marker */}
            {homeLocation.latitude && homeLocation.longitude && (
              <Marker position={[homeLocation.latitude, homeLocation.longitude]} layerName="home" icon={homeIcon} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
                {/* Popup for home marker */}
              </Marker>
            )}

            {/* This is for the amenities radius circle */}
            {homeLocation.latitude && homeLocation.longitude && (
              addCircleToMap(mapRef.current, [homeLocation.latitude, homeLocation.longitude], distance * 1000) // Adjust radius as needed
            )}

            <MapStylePanel />
          </LeafletMap>

          {/* This area is the form for the Map */}
          <h3 style={{ marginBottom: '5px' }}>Set Home Waypoint</h3>
          <label>Address: </label>
          <input type='text' placeholder="Enter Address here..." onChange={(e) => setAddressField(e.target.value)}></input>
          {errorMessage && (
            <div style={{ color: 'red' }}>{errorMessage}</div>
          )}
          <button onClick={handleGeocode}>Find Home</button>
          {auth.currentUser && <button onClick={setHome}>Set Home</button>}
          {auth.currentUser && <button onClick={loadHome}>Load Saved Home Location</button>}
          <button onClick={toggleJson}>Toggle GEOJson</button>
          <button onClick={clearMap}>Clear Map</button>

          {/* This is to show latitude and longitude coords when available*/}
          {homeLocation.latitude && homeLocation.longitude && (
            <h4>Latitude: {homeLocation.latitude}, Longitude: {homeLocation.longitude}, Road: {homeLocation.address}</h4>
          )}

        </div>
      </div>
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
    if (!textContent || !tdElement || !tdElement.textContent.trim() || textContent === 'LANDYADDRESSPOINT' || textContent === 'LANDXADDRESSPOINT' || textContent === 'INC_CRC' || textContent === 'FMEL_UPD_D' || textContent === 'PHOTOURL' || textContent === 'EST_ORIGINAL_COMPLETION_DATE' || textContent === 'ADDRESSBLOCKHOUSENUMBER') {
      thElement.parentNode.remove();
    }
  });
  return tempElement.innerHTML;
};

export default GeojsonMapComponent;
