import "../css/global.css";
import "../css/dashboard.css";
import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Slider from "@mui/material/Slider";

/**
 * Input component for selecting options and displaying relevant information.
 *
 * @param {Object} props - The properties passed to the Input component.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.defaultValue - The default value of the input field.
 * @param {string} props.placeholder - The placeholder text for the input field.
 * @param {Function} props.onChange - The function to handle changes in the input field.
 * @returns {JSX.Element} - Returns the JSX representation of the Input component.
 */
const Input = ({ name, defaultValue, placeholder, onChange }) => {
  const [selected, setSelected] = useState(defaultValue);
  const [viewSelected, setViewSelected] = useState(false);
  const [optionSelected, setOptionSelected] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [distance, setDistance] = useState(5);
  const [addressField, setAddressField] = useState("");
  const [destGeoCode, setDestGeoCode] = useState({
    latitude: null,
    longitude: null,
  });

  const Transportation = ["Select an option", "Car", "Public Transport"];

  const Amenities = [
    "Select an option",
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
  } else if (selected === "Amenities") {
    type = Amenities;
  }

  if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
  }

  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);
    setViewSelected(true);
    onChange({
      selected: event.target.value,
      optionSelected,
      distance,
      addressField,
      destGeoCode,
    }); // Pass an object with both values
  };

  const handleOptionChange = (event) => {
    setOptionSelected(event.target.value); // Update the selected option state
    onChange({
      selected,
      optionSelected: event.target.value,
      distance,
      addressField,
      destGeoCode,
    });
  };

  // Function to validate address and return geocode Address
  const validateAddress = async (address) => {
    try {
      const geocodingResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&addressdetails=1&limit=1`
      );
      if (geocodingResponse.data.length > 0) {
        console.log(geocodingResponse.data[0]);
        const { lat, lon } = geocodingResponse.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road =
          geocodingResponse.data[0].address.road ||
          geocodingResponse.data[0].address.suburb ||
          geocodingResponse.data[0].address.postcode;

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
          setErrorMessage(null);
          setDestGeoCode({
            latitude: latitude,
            longitude: longitude,
          });

          console.log("New destination" + JSON.stringify(destGeoCode));
        } else {
          setErrorMessage(
            "The location of is outside Singapore. Please refine your search."
          );
          setAddressField("");
        }
      } else {
        setErrorMessage("Invalid address, please input valid address again.");
        setAddressField("");
      }
    } catch (error) {
      setErrorMessage("Error geocoding Address.");
      setAddressField("");
    }
    return null;
  };

  useEffect(() => {
    console.log("New destination", destGeoCode);
    onChange({
      selected,
      optionSelected,
      distance,
      addressField,
      destGeoCode,
    });
  }, [destGeoCode]);

  const renderAddressInput = () => {
    if (selected === "Transportation" && viewSelected) {
      return (
        <div className="modal mt-2 ">
          <input
            type="text"
            placeholder="Enter address. Press L-Shift to confirm"
            value={addressField}
            onChange={(e) => {
              setAddressField(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Shift" && e.location === 1) {
                validateAddress(addressField);
              }
            }}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p style={{fontSize: "13px", fontStyle: "italic"}}>Press L-Shift in the address field above to confirm</p>
        </div>
      );
    }
    return null;
  };

  const renderRadiusInput = () => {
    if (selected === "Amenities" && viewSelected) {
      return (
        <div className="flex flex-col items-center mt-2">
          <div style={{ minWidth: "50%" }}>
            <h3>Filter Distance (in km): {distance} km</h3>
            <Slider
              aria-label="Restricted values"
              defaultValue={5}
              step={1}
              min={1}
              max={10}
              marks={[
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
                { value: 7, label: "7" },
                { value: 8, label: "8" },
                { value: 9, label: "9" },
                { value: 10, label: "10" },
              ]}
              onChange={(e) => {
                setDistance(e.target.value);
                onChange({
                  selected,
                  optionSelected,
                  distance: e.target.value,
                  addressField,
                  destGeoCode,
                });
              }}
              sx={{ color: "#f7776b" }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <form>
        <div className="flex items-center justify-left w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <select
            className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={changeSelectOptionHandler}
          >
            <option>Select an option</option>
            <option value="Transportation">Transportation</option>{" "}
            <option value="Amenities">Amenities</option>{" "}
          </select>
        </div>

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {renderAddressInput()}

        <div className="mt-2">
          {viewSelected && (
            <select
              className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleOptionChange} // Call handleOptionChange on change
              value={optionSelected} // Bind the selected option state
            >
              {options}
            </select>
          )}
        </div>
        {renderRadiusInput()}
      </form>
    </div>
  );
};

export default Input;
