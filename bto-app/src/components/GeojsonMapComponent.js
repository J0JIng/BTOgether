import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Icon } from "leaflet";
import {
  getFirestore,
  collection,
  updateDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import {
  Box,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Container,
  Stack,
  Button,
} from "@mui/material";
import { InputAdornment, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { query, where } from "firebase/firestore";
import { auth } from "../utils/firebase";
import { getDistanceFromLatLonInKm } from "../utils/GetDistanceFromLatLonInKm";
import { extractNameFromHtml } from "../utils/extractNameFromHtml";
import { MapStylePanel } from "./MapStylePanel";

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

import transit2 from "../icons/transit2.png";
import transit from "../icons/transit.png";
import satellite from "../icons/satellite.png";
import base from "../icons/base.png";

const GeojsonMapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [markerIcon, setMarkerIcon] = useState();
  const [mapTitle, setMapTitle] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const [homeLocation, setHomeLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [distance, setDistance] = useState(1);
  const [chosenJson, setChosenJson] = useState("");
  const [mapStyle, setMapStyle] = useState(
    "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
  );
  const [currentSource, setCurrentSource] = useState(satellite);
  const [routingLocation, setRoutingLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [addressField, setAddressField] = useState("");
  const mapRef = useRef(null);
  const iconSize = 36;
  const [showPopup, setShowPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [numberofroomsinform, setNumberOfRoomsInForm] = useState();
  const [projectnameinform, setProjectNameInForm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("");

  // These are the icons for the map
  const gymIcon = new Icon({
    iconUrl: require("../icons/gympin.png"),
    iconSize: [iconSize, iconSize],
  });
  const hawkerIcon = new Icon({
    iconUrl: require("../icons/hawkerpin.png"),
    iconSize: [iconSize, iconSize],
  });
  const homeIcon = new Icon({
    iconUrl: require("../icons/home-button.png"),
    iconSize: [iconSize, iconSize],
  });
  const parkIcon = new Icon({
    iconUrl: require("../icons/parks.png"),
    iconSize: [iconSize, iconSize],
  });
  const preschoolIcon = new Icon({
    iconUrl: require("../icons/preschools.png"),
    iconSize: [iconSize, iconSize],
  });
  const clincsIcon = new Icon({
    iconUrl: require("../icons/clinics.png"),
    iconSize: [iconSize, iconSize],
  });
  const mallsIcon = new Icon({
    iconUrl: require("../icons/malls.png"),
    iconSize: [iconSize, iconSize],
  });

  // This is the API key for the public transport route using HERE
  const apiKey = "ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI"; // HERE API key

  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, "User_prefs");

  const HomeSetPopup = ({ onClose }) => {
    return (
      <div
        className="popup-container"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          background: "white",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>Home location set successfully!</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  useEffect(() => {
    console.log(myhome);
  });

  const [myhome, setMyHome] = useState({
    BTO1: {
      address: 0,
      latitude: 0,
      longitude: 0,
      projectname: "placeholder",
      numberofrooms: "placeholder",
    },
    BTO2: {
      address: 0,
      latitude: 0,
      longitude: 0,
      projectname: "placeholder",
      numberofrooms: "placeholder",
    },
    BTO3: {
      address: 0,
      latitude: 0,
      longitude: 0,
      projectname: "placeholder",
      numberofrooms: "placeholder",
    },
  });

  const handleNumberOfRoomsInForm = (event) => {
    setNumberOfRoomsInForm(event.target.value);
  };

  const handleProjectNameInForm = (event) => {
    setProjectNameInForm(event.target.value);
  };

  const savingInBTO = (index) => {
    const q = query(colRef, where("email", "==", auth.currentUser.email));

    getDocs(q)
      .then((snapshot) => {
        const btoKey = `BTO${index}`;
        const updatedBTOData = {
          address: homeLocation.address,
          latitude: homeLocation.latitude,
          longitude: homeLocation.longitude,
          projectname: projectnameinform,
          numberofrooms: numberofroomsinform,
        };

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          const currentDocData = snapshot.docs[0].data();

          const updatedDocData = {
            ...currentDocData,
            [btoKey]: updatedBTOData,
          };

          console.log("Updating existing document:", updatedDocData);

          updateDoc(docRef, updatedDocData)
            .then(() => {
              console.log("Document updated successfully!");
              setMyHome(updatedDocData);
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        } else {
          console.log("No document found, creating a new one.");
          const newHomeData = {
            email: auth.currentUser.email,
            [btoKey]: updatedBTOData,
          };

          addDoc(colRef, newHomeData)
            .then(() => {
              console.log("Document created successfully!");
              setMyHome(newHomeData);
            })
            .catch((error) => {
              console.error("Error creating new document:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });

    setShowFormPopup(false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeFormPopup = () => {
    setShowFormPopup(false);
    // setShowPopup(true);
  };

  const handleShowDetails = (val) => {
    setShowDetails(true);

    const q = query(colRef, where("email", "==", auth.currentUser.email));

    getDocs(q)
      .then((snapshot) => {
        // Check if a document exists
        if (snapshot.empty) {
          alert("No document found with provided email");
          return;
        }

        // Get the document reference from the first snapshot
        const docData = snapshot.docs[0].data();
        console.log(docData, "docData");

        // Update the UI based on the selected BTO
        if (val === 1) {
          if (docData.BTO1.projectname === "placeholder") {
            alert("No records exist for BTO1");
          } else {
            setProjectName(docData.BTO1.projectname);
            setNumberOfRooms(docData.BTO1.numberofrooms);
            setHomeLocation({
              address: docData.BTO1.address,
              latitude: docData.BTO1.latitude,
              longitude: docData.BTO1.longitude,
            });
            setDistance(1);
            flyToCoords(docData.BTO1.latitude, docData.BTO1.longitude);
          }
        } else if (val === 2) {
          if (docData.BTO2.projectname === "placeholder") {
            alert("No records exist for BTO2");
          } else {
            setProjectName(docData.BTO2.projectname);
            setNumberOfRooms(docData.BTO2.numberofrooms);
            setHomeLocation({
              address: docData.BTO2.address,
              latitude: docData.BTO2.latitude,
              longitude: docData.BTO2.longitude,
            });
            setDistance(1);
            flyToCoords(docData.BTO2.latitude, docData.BTO2.longitude);
          }
        } else if (val === 3) {
          if (docData.BTO3.projectname === "placeholder") {
            alert("No records exist for BTO3");
          } else {
            setProjectName(docData.BTO3.projectname);
            setNumberOfRooms(docData.BTO3.numberofrooms);
            setHomeLocation({
              address: docData.BTO3.address,
              latitude: docData.BTO3.latitude,
              longitude: docData.BTO3.longitude,
            });
            setDistance(1);
            flyToCoords(docData.BTO3.latitude, docData.BTO3.longitude);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const FormPopup = () => {
    return (
      <Box
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          background: "white",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputLabel
          id="demo-simple-project-name"
          sx={{
            color: "black",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Enter details:{" "}
        </InputLabel>
        <Box style={{ marginBottom: 20, marginTop: 10 }}>
          <InputLabel id="demo-simple-project-name">Project Name</InputLabel>
          <input
            style={{ width: "95%", height: 32, fontSize: "1rem" }}
            type="text"
            value={projectnameinform}
            onChange={handleProjectNameInForm}
          />
          {/* <TextField id="standard-basic" label="Standard" variant="standard" /> */}
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-number-rooms">
              Number of rooms
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={numberofroomsinform}
              label="Number of rooms"
              onChange={handleNumberOfRoomsInForm}
              sx={{ width: "100%" }}
            >
              <MenuItem value={2}>2-room </MenuItem>
              <MenuItem value={3}>3-room</MenuItem>
              <MenuItem value={4}>4-room</MenuItem>
              <MenuItem value={5}>5-room</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <button onClick={() => savingInBTO(1)}>Save as BTO1</button>
        <button onClick={() => savingInBTO(2)}>Save as BTO2</button>
        <button onClick={() => savingInBTO(3)}>Save as BTO3</button>

        <button onClick={closeFormPopup}>Close</button>
      </Box>
    );
  };

  const setHome = () => {
    let homeLayerExists = false; // Flag to track if the 'home' layer exists

    mapRef.current.eachLayer((layer) => {
      if (layer.options.layerName === "home") {
        homeLayerExists = true; // Set flag to true if 'home' layer is found
        setShowFormPopup(true);
      }
    });

    if (homeLayerExists) {
      // Home pin is on map, proceed to set home
      const q = query(colRef, where("email", "==", auth.currentUser.email));
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
        if (snapshot.empty) {
          alert("No document found with provided email");
          return;
        }
        // Get the document reference from the first snapshot
        const docData = snapshot.docs[0].data();
        console.log(docData, "DOCDATA");
        // Update the document
        const homeAddress = docData.homeAddress;
        const homeLatitude = docData.homeLatitude;
        const homeLongitude = docData.homeLongitude;
        if (homeLatitude && homeLongitude) {
          setHomeLocation({
            address: homeAddress,
            latitude: homeLatitude,
            longitude: homeLongitude,
          });
          setErrorMessage("");
          setDistance(1);
          flyToCoords(homeLatitude, homeLongitude);
        } else {
          console.log("No home location saved");
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const clearMap = () => {
    setShowDetails(false);

    mapRef.current.eachLayer((layer) => {
      if (layer.options.layerName !== "mapLayer") {
        mapRef.current.removeLayer(layer);
      }
    });
    setRoutingLocation({ latitude: null, longitude: null });
    setHomeLocation({ address: "", latitude: null, longitude: null });
    setChosenJson("");
    setMapCenter(1.354, 103.825);
    mapRef.current.flyTo([1.354, 103.825], 12, {
      animate: true,
      duration: 1, // in seconds
    });
    setErrorMessage("");
  };

  // This is to parse the GEOJson data
  useEffect(() => {
    if (chosenJson) {
      fetch(chosenJson)
        .then((response) => response.json())
        .then((data) => {
          const newMarkers = data.features
            .map((feature) => {
              const { Description } = feature.properties;
              const { coordinates } = feature.geometry;
              const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
              return {
                geocode: [lat, lng],
                popUp: Description, // Assuming Description contains HTML content
              };
            })
            // Filter markers by distance
            .filter((marker) => {
              if (!homeLocation.latitude || !homeLocation.longitude)
                return true; // Show all if no home marker is set
              const distanceFromHome = getDistanceFromLatLonInKm(
                homeLocation.latitude,
                homeLocation.longitude,
                marker.geocode[0],
                marker.geocode[1]
              );
              return distanceFromHome <= distance;
            });
          setMarkers(newMarkers);
        })
        .catch((error) => console.error("Error fetching GeoJSON:", error));
    }
    if (chosenJson === "") {
      setMarkerIcon(null);
      setMarkers([]);
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
    handleReverseGeocode(position.lat.toFixed(5), position.lng.toFixed(5));
    setHomeLocation((prevHomeLocation) => ({
      ...prevHomeLocation,
      latitude: position.lat.toFixed(5),
      longitude: position.lng.toFixed(5),
    }));
    flyToCoords(position.lat.toFixed(5), position.lng.toFixed(5));
  };

  // This is for the address field, to convert user input to latitude and longitude
  const handleGeocode = async () => {
    if (addressField === null || addressField === "") {
      alert("Type in an Address");
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${addressField}&format=json&addressdetails=1&limit=1`
      );
      if (response.data.length > 0) {
        console.log(response.data[0]);
        const { lat, lon } = response.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road = response.data[0].address.road
          ? response.data[0].address.road
          : response.data[0].display_name;

        const singaporeBounds = {
          north: 1.5,
          south: 1.1,
          east: 104.1,
          west: 103.6,
        };

        if (
          latitude >= singaporeBounds.south &&
          latitude <= singaporeBounds.north &&
          longitude >= singaporeBounds.west &&
          longitude <= singaporeBounds.east
        ) {
          setHomeLocation({
            address: road,
            latitude: latitude,
            longitude: longitude,
          });
          setErrorMessage("");
          // Fly to the location
          flyToCoords(latitude, longitude);
        } else {
          setErrorMessage(
            "The location is outside Singapore. Please refine your search."
          );
        }
      } else {
        setErrorMessage("Address not found");
      }
    } catch (error) {
      setErrorMessage("Error geocoding address");
      console.error("Error geocoding address:", error);
    }
  };

  const flyToCoords = (lat, long) => {
    if (mapRef.current && lat && long) {
      mapRef.current.flyTo([lat, long], 17, {
        animate: true,
        duration: 1, // in seconds
      });
    }
  };

  const handleReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      if (response.data) {
        console.log(response.data);
        const road = response.data.address.road
          ? response.data.address.road
          : response.data.display_name;
        setHomeLocation({
          address: road,
          latitude: latitude,
          longitude: longitude,
        });
        setMapCenter([latitude, longitude]);
        setErrorMessage("");
      } else {
        setErrorMessage("Address not found");
      }
    } catch (error) {
      setErrorMessage("Error reverse geocoding address");
      console.error("Error reverse geocoding address:", error);
    }
  };

  const toggleJson = () => {
    setRoutingLocation({ latitude: null, longitude: null });
    if (chosenJson === gymgeojson) {
      setChosenJson(hawkergeojson);
    } else if (chosenJson === hawkergeojson) {
      setChosenJson(parksgeojson);
    } else if (chosenJson === parksgeojson) {
      setChosenJson(preschoolgeojson);
    } else if (chosenJson === preschoolgeojson) {
      setChosenJson(clinicgeojson);
    } else if (chosenJson === clinicgeojson) {
      setChosenJson(mallsgeojson);
    } else if (chosenJson === mallsgeojson) {
      setChosenJson("");
    } else {
      setChosenJson(gymgeojson);
    }
  };

  // Add a function to add a circle to the map
  const addCircleToMap = (map, center, radius) => {
    if (map && center) {
      return (
        <Circle
          center={center}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
          radius={radius}
          layerName="circle"
        />
      );
    }
  };

  // useEffect for radius circle
  useEffect(() => {
    if (mapRef.current && homeLocation.latitude && homeLocation.longitude) {
      const circle = addCircleToMap(
        mapRef.current,
        [homeLocation.latitude, homeLocation.longitude],
        distance * 1000
      );
      if (circle) {
        const map = mapRef.current.leafletElement;
        if (map) {
          map.addLayer(circle);
        }
      }
    }
  }, [homeLocation]);

  const routeHere = (coords) => {
    setRoutingLocation({ latitude: coords[0], longitude: coords[1] });
    mapRef.current.closePopup();
  };

  // Function to parse HTML content and extract ADDRESSSTREETNAME values
  const extractAttributeName = (obj, key) => {
    if (obj && obj.hasOwnProperty("popUp")) {
      const popUpHTML = obj.popUp;
      const regex = new RegExp(`<th[^>]*>${key}<\/th>\\s*<td[^>]*>(.*?)<\/td>`);
      const match = popUpHTML.match(regex);

      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return ""; // Return "" if the property doesn't exist or couldn't be extracted
  };

  // This is the content for the Map
  return (
    <Container sx={{ mr: 1, boxShadow: 3 }} maxWidth="100%">
      <div className="map-container__top-bar">
        <h2>Map View of {mapTitle}</h2>

        {/* Distance slider*/}
        <div className="slider-container">
          <label htmlFor="distance-slider">Filter Distance (in km): </label>
          <input
            id="distance-slider"
            className="slider"
            type="range"
            min="0"
            max="10"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <span className="slider-distance">{distance} km</span>
          {showDetails && (
            <div>
              <span style={{ fontWeight: "bold", fontSize: 18 }}>
                Project Name:{" "}
              </span>
              {projectName}
              <br />
              <span style={{ fontWeight: "bold", fontSize: 18 }}>
                Number of Rooms:{" "}
              </span>
              {numberOfRooms}
            </div>
          )}
        </div>
      </div>

      <div className="panel-wrapper">
        {/* Updated left panel with the table of markers and public transport table */}
        <div className="left-panel">
          {/* Table of Markers */}
          {markers.length > 0 && (
            <div className="table-container">
              <table className="table-style">
                <thead>
                  <tr>
                    <th>
                      {markers.length} {mapTitle} in {distance}km Radius:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {markers.map((marker, index) => (
                    <>
                      <tr key={index}>
                        <td>
                          <div className="table-style__name">
                            {extractNameFromHtml(marker)}
                          </div>
                          <div className="table-style__address">
                            <span>
                              {extractAttributeName(
                                marker,
                                "ADDRESSSTREETNAME"
                              )}
                            </span>
                            {extractAttributeName(marker, "ADDRESSPOSTALCODE")}
                            <span>
                              {extractAttributeName(marker, "STREET_NAME")}
                            </span>
                            {extractAttributeName(marker, "POSTAL_CD")}
                          </div>
                          <div className="table-style__maptitle">
                            <img
                              src={markerIcon.options.iconUrl}
                              alt={JSON.stringify(markerIcon)}
                              style={{ width: 24, height: 24, marginRight: 5 }}
                            />
                            {mapTitle.slice(0, -1)}
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Public Transport Table */}
          <div className="public-transport-route">
            {routingLocation.latitude && routingLocation.longitude ? (
              <Routing
                startLat={homeLocation.latitude}
                startLng={homeLocation.longitude}
                endLat={routingLocation.latitude}
                endLng={routingLocation.longitude}
                apiKey={apiKey}
                mapRef={mapRef}
              />
            ) : (
              <p> Select a destination to find public transport routes</p>
            )}
          </div>
        </div>

        <div className="right-panel">
          <Container style={{ margin: "10px", padding: "0px" }}>
            <LeafletMap
              center={mapCenter}
              zoom={11.5}
              ref={mapRef}
              style={{
                height: "70vh",
                border: "4px LightSteelBlue solid",
                borderRadius: "5px",
                marginRight: "20px",
              }}
            >
              {/* Google Map Tile Layer */}
              <TileLayer
                attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                url={mapStyle}
                layerName="mapLayer"
              />
              {currentSource === transit2 && (
                <TileLayer
                  attribution={`Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`}
                  url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
                  layerName="mapLayer"
                />
              )}
              {/* This is for the driving route */}
              <RoutingMachine
                start={homeLocation}
                markerLat={routingLocation.latitude}
                markerLng={routingLocation.longitude}
              />

              {/* This are markers from the GEOJson data */}
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.geocode} icon={markerIcon}>
                  <Popup>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: filterHtmlContent(marker.popUp),
                      }}
                    />
                    <button onClick={() => routeHere(marker.geocode)}>
                      Get Directions
                    </button>
                  </Popup>
                </Marker>
              ))}

              {/* This is for the home marker */}
              {homeLocation.latitude && homeLocation.longitude && (
                <Marker
                  position={[homeLocation.latitude, homeLocation.longitude]}
                  layerName="home"
                  icon={homeIcon}
                  draggable={true}
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                >
                  {/* Popup for home marker */}
                </Marker>
              )}

              {/* This is for the amenities radius circle */}
              {homeLocation.latitude &&
                homeLocation.longitude &&
                addCircleToMap(
                  mapRef.current,
                  [homeLocation.latitude, homeLocation.longitude],
                  distance * 1000
                ) // Adjust radius as needed
              }

              <MapStylePanel
                currentSource={currentSource}
                setMapStyle={setMapStyle}
                setCurrentSource={setCurrentSource}
              />
            </LeafletMap>
          </Container>
          {/* This area is the form for the Map */}
          {/* Form for the Map */}
          <Container sx={{ mb: 2 }}>
            <h3>Set Home Waypoint</h3>
            <TextField
              variant="outlined"
              label="Enter Address"
              onChange={(e) => setAddressField(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              error={errorMessage != ""}
              helperText={errorMessage ? errorMessage : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={handleGeocode}
                    >
                      <Typography>Search</Typography>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack
              sx={{ mb: 2 }}
              spacing={{ xs: 1 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                onClick={setHome}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                Set Home
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={toggleJson}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                Toggle Amenities
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={clearMap}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                Clear Map
              </Button>
            </Stack>
            <hr />
            <h3>Load BTOs</h3>
            <Stack
              spacing={{ xs: 1 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                onClick={() => handleShowDetails(1)}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                View BTO1
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={() => handleShowDetails(2)}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                View BTO2
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={() => handleShowDetails(3)}
                sx={{ mr: 1, boxShadow: 1, textTransform: "none" }}
              >
                View BTO3
              </Button>
            </Stack>
          </Container>
        </div>
      </div>
      <div className="info-section">
        <p>
          For more information on upcoming BTOs, you can visit{" "}
          <a
            href="https://homes.hdb.gov.sg/home/landing"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://homes.hdb.gov.sg/home/landing
          </a>
        </p>
      </div>

      <div>{showPopup && <HomeSetPopup onClose={closePopup} />}</div>
      <div>{showFormPopup && FormPopup()}</div>
    </Container>
  );
};

// This is to parse the GEOJson data to semi-readable format
const filterHtmlContent = (htmlContent) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlContent;
  tempElement.querySelectorAll("th").forEach((thElement) => {
    const textContent = thElement.textContent.trim();
    const tdElement = thElement.nextElementSibling;
    if (
      !textContent ||
      !tdElement ||
      !tdElement.textContent.trim() ||
      textContent === "LANDYADDRESSPOINT" ||
      textContent === "LANDXADDRESSPOINT" ||
      textContent === "INC_CRC" ||
      textContent === "FMEL_UPD_D" ||
      textContent === "PHOTOURL" ||
      textContent === "EST_ORIGINAL_COMPLETION_DATE" ||
      textContent === "ADDRESSBLOCKHOUSENUMBER"
    ) {
      thElement.parentNode.remove();
    }
  });
  return tempElement.innerHTML;
};

export default GeojsonMapComponent;
