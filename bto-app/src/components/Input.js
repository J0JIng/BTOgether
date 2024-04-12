import "../css/global.css";
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
import { query, where } from "firebase/firestore";
import { auth } from "../utils/firebase";

// GeoJson Files
import gymgeojson from "../geojson/GymsSGGEOJSON.geojson";
import hawkergeojson from "../geojson/HawkerCentresGEOJSON.geojson";
import parksgeojson from "../geojson/Parks.geojson";
import preschoolgeojson from "../geojson/PreSchoolsLocation.geojson";
import clinicgeojson from "../geojson/CHASClinics.geojson";
import mallsgeojson from "../geojson/shopping_mall_coordinates.geojson";
import satellite from "../icons/satellite.png";

const Input = ({ name, defaultValue, placeholder, onChange }) => {
  const [selected, setSelected] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("");
  const [viewSelected, setViewSelected] = useState(false);
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

  const flyToCoords = (lat, long) => {
    if (mapRef.current && lat && long) {
      mapRef.current.flyTo([lat, long], 17, {
        animate: true,
        duration: 1, // in seconds
      });
    }
  };

  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);

    setViewSelected(true);
  };

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
        const { lat, lon } = response.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road = response.data[0].address.road
          ? response.data[0].address.road
          : response.data[0].address.suburb;

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

  const handleConfirmTransportation = () => {
    // You can implement logic here to handle transportation confirmation
    console.log("Transportation confirmed:", selected);
  };

  const handleConfirmAmenities = () => {
    // You can implement logic here to handle amenities confirmation
    console.log("Amenities confirmed:", selected, radius);
  };

  const renderAddressInput = () => {
    if (selected === "Transportation" && viewSelected) {
      return (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      );
    }
    return null;
  };

  const renderRadiusInput = () => {
    if (selected === "Amenities" && viewSelected) {
      return (
        <div className="flex flex-col items-center mt-2">
          <label htmlFor="distance-slider" className="mb-2">Filter Distance (in km): </label>
          <input
            id="distance-slider"
            className="w-full"
            type="range"
            min="0"
            max="10"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <span className="text-center">{distance} km</span>
        </div>
      );
    }
    return null;
  };
  
  
  

  const Transportation = ["Car", "Public Transport", "Walk"];

  const Amenities = [
    "Gyms",
    "Hawkers",
    "Parks",
    "Preschools",
    "Clinics",
    "Malls",
  ];

  let type = null;

  let options = null;

  if (selected === "Transportation") {
    type = Transportation;
    //setViewSelected(true);
  } else if (selected === "Amenities") {
    type = Amenities;
    //setViewSelected(true);
  } else {
    //setViewSelected(false);
  }

  if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
  }

  return (
    <div className="w-full">
      <form>
        <div className="flex items-center justify-left w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <select
            className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={changeSelectOptionHandler}
          >
            <option>Select an option</option>
            <option>Transportation</option>
            <option>Amenities</option>
          </select>
        </div>
        <div className="mt-2">
          {viewSelected && (
            <select className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              {options} {/* Render the options array directly */}
            </select>
          )}
        </div>

        {renderAddressInput()}
        {renderRadiusInput()}
      </form>
    </div>
  );
};

export default Input;
