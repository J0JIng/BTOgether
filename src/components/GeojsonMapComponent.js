import React, { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";

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
  const [homeMarker, setHomeMarker] = useState([]);
  const [distance, setDistance] = useState(5); 
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
          })
          // Filter markers by distance
          .filter((marker) => {
            if (!homeMarker[0] || !homeMarker[1]) return true; // Show all if no home marker is set
            const distanceFromHome = getDistanceFromLatLonInKm(homeMarker[0], homeMarker[1], marker.geocode[0], marker.geocode[1]);
            return distanceFromHome <= distance;
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
  }, [filePath, homeMarker,distance]);

  // Custom style for the popup
  const popupStyle = {
    maxHeight: "100px",
    overflowY: "auto"
  };

  const updateHome = (coords, type) => {
    //1.3874, 103.897
    if (coords !== 0) {
      // Parse and validate input (optional, but recommended)
      const parsedCoords = parseFloat(coords.trim());
      if (isNaN(parsedCoords)) {
        console.error("Invalid input: Please enter a valid number for latitude or longitude.");
        return; // Prevent further processing if invalid
      }
  
      return setHomeMarker(prevHomeMarker => {
        const updatedArray = [...prevHomeMarker];
  
        if (type === "lat") {
          updatedArray[0] = parsedCoords;
        } else {
          updatedArray[1] = parsedCoords;
        }
  
        return updatedArray;
      })
    }
  };
  

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

    <LeafletMap center={[1.354, 103.825]} zoom={11.5} ref={mapRef} style={{ height: '60vh', width: '1000px', border: '4px LightSteelBlue solid'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={markerIcon}>
          <Popup style={popupStyle}>
            {/* Integration of filtered and non-blank HTML content from Description into the Popup */}
            <div dangerouslySetInnerHTML={{ __html: filterHtmlContent(marker.popUp) }} />
          </Popup>
        </Marker>
      ))}
      {homeMarker[0] && homeMarker[1] && (
        <Marker key={0} position={homeMarker} icon={homeIcon}>
          <Popup><h3>Home</h3></Popup>
        </Marker>
      )}
    </LeafletMap>
    <h3 style={{ marginBottom: '5px'}}>Set Home Waypoint</h3>
    <label>Latitude: </label>
    <input type='text' name="lat" onChange={(e) => updateHome(e.target.value, "lat")}></input>
    <label> Longtitude: </label>
    <input type='text' name="long" onChange={(e) => updateHome(e.target.value, "long")}></input>
    <button onClick={() => {homeMarker[0] != null && homeMarker[1] != null && mapRef.current.flyTo(homeMarker)}}>Fly Home</button>
    <button onClick={(e) => mapRef.current.flyTo([1.354, 103.825])}>Center to SG</button>
    </div>

    
  );
};

// Function to filter out specific HTML content and remove blank rows
const filterHtmlContent = (htmlContent) => {
  // Create a temporary DOM element to parse the HTML content
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;
  
  // Select all <th> elements and remove the ones with specified text content or if the corresponding <td> is blank
  tempElement.querySelectorAll('th').forEach((thElement) => {
    const textContent = thElement.textContent.trim();
    const tdElement = thElement.nextElementSibling;
    if (!textContent || !tdElement || !tdElement.textContent.trim() || textContent === 'LANDYADDRESSPOINT'|| textContent === 'LANDXADDRESSPOINT'|| textContent === 'INC_CRC'|| textContent === 'FMEL_UPD_D') {
      thElement.parentNode.remove(); // Remove the entire row if the <th> text content is blank or if the corresponding <td> is blank
    }
  });
  
  // Return the filtered HTML content
  return tempElement.innerHTML;
};

export default GeojsonMapComponent;