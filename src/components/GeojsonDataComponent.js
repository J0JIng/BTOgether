import React, { useState, useEffect } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { Icon, map } from "leaflet";

const GeojsonDataComponent = ({ filePath }) => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();

  const gymIcon = new Icon({ iconUrl: require("../icons/gympin.png"), iconSize: [38, 38]});
  const hawkerIcon = new Icon({ iconUrl: require("../icons/hawkerpin.png"), iconSize: [38, 38]});

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
  }, [filePath]);

  // Custom style for the popup
  const popupStyle = {
    maxHeight: "100px",
    overflowY: "auto"
  };

  return (
    <div>
    <h2 style={{marginBottom: 10}}>Map View of {mapTitle}</h2>
    <LeafletMap center={[1.3634488, 103.8165308]} zoom={12.26} style={{ height: '60vh', width: '1000px', border: '4px LightSteelBlue solid'}}>
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
    </LeafletMap>
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

export default GeojsonDataComponent;
