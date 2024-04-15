import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, InputAdornment, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios"; // Import axios

export default function MapDialog({ type, locationInfo }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(); // Define errorMessage state
  const [formData, setFormData] = useState("");
  const [coords, setCoords] = useState();
  const [mapCenter, setMapCenter] = useState([1.354, 103.825]);
  const mapRef = useRef(null);
  const homeIcon = new Icon({
    iconUrl: require("../icons/home-button.png"),
    iconSize: [36, 36],
  });

  const [homeLocation, setHomeLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [canSubmit, setCanSubmit] = useState(false);

  const handleClickOpen = () => {
    setFormData("");
    setCanSubmit(false);
    setErrorMessage();
    setHomeLocation({
      address: "",
      latitude: null,
      longitude: null,
    });
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    locationInfo(homeLocation);
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      // Geocode the address for each updated field
      //console.log(formData)
      const geocodedAddress = await geocodeAddress(formData);
      if (geocodedAddress != null) {
        setCanSubmit(true);
      }
    } catch (error) {
      //setErrorMessage('Error geocoding address');
      console.error("Error geocoding address:", error);
      setCanSubmit(false);
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

  // Function to geocode the address
  const geocodeAddress = async (address) => {
    try {
      const geocodingResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&addressdetails=1&limit=1`
      );
      if (geocodingResponse.data.length > 0) {
        const { lat, lon } = geocodingResponse.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road =
          geocodingResponse.data[0].address.road ||
          geocodingResponse.data[0].display_name;
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
          setCanSubmit(true);
          // Fly to the location
          flyToCoords(latitude, longitude);
          setErrorMessage(null);
          return {
            latitude,
            longitude,
            road,
          };
        } else {
          setErrorMessage(
            "The location of is outside Singapore. Please refine your search."
          );
          setCanSubmit(false);
        }
      } else {
        setErrorMessage("Address not found.");
        setCanSubmit(false);
      }
    } catch (error) {
      setErrorMessage("Error geocoding Address.");
      setCanSubmit(false);
    }
    return null; // Return null if geocoding fails
  };

  const handleReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      if (response.data) {
        const road = response.data.address.road
          ? response.data.address.road
          : response.data.display_name;
        setHomeLocation({
          address: road,
          latitude: latitude,
          longitude: longitude,
        });
        setCanSubmit(true);
        setMapCenter([latitude, longitude]);
        setErrorMessage();
      } else {
        setCanSubmit(false);
        setErrorMessage("Address not found");
      }
    } catch (error) {
      setErrorMessage("Error reverse geocoding address");
      setCanSubmit(false);
      console.error("Error reverse geocoding address:", error);
    }
  };

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

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style={{ marginBottom: "10px", backgroundColor: "#f7776b",
        "&:hover": { backgroundColor: "#c55f55" }, }}
      >
        Set{" "}
        {type == "parentsAddress" ? "Parent's Address" : "Workplace Address"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-title">
          Find New{" "}
          {type != "parentsAddress" ? "Parent's Address" : "Workplace Address"}
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ width: "100%", marginTop: "10px" }}
            variant="outlined"
            label="Enter New Address"
            name={type}
            onChange={handleChange}
            value={formData}
            fullWidth
            sx={{ mb: 2 }}
            error={errorMessage != null}
            helperText={errorMessage ? errorMessage : null}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" color="primary" onClick={handleSubmit}>
                    <Typography>Search</Typography>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(); // Call your search function here
              }
            }}
          />
          <div style={{ marginRight: "7px" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {homeLocation.address}
            </Typography>
            <LeafletMap
              center={mapCenter}
              zoom={11.5}
              ref={mapRef}
              style={{
                height: "60vh",
                width: "100%",
                border: "4px LightSteelBlue solid",
                borderRadius: "5px",
              }}
            >
              {/* Google Map Tile Layer */}
              <TileLayer
                attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
                layerName="mapLayer"
              />

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
            </LeafletMap>
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: "10px", marginRight: "10px" }}>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            disabled={!canSubmit}
            sx={{backgroundColor: "#f7776b",
            "&:hover": { backgroundColor: "#c55f55" },}}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
