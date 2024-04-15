import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { query, where } from "firebase/firestore";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Container,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TileLayer, Marker, MapContainer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapDialog from "./MapDialog";
import { Icon } from "leaflet";
import { Toaster, toast } from "sonner";
import DeleteAccountDialog from "./DeleteAccountDialog";

const UserProfileForm = () => {
  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, "User_prefs");
  const homeIcon = new Icon({
    iconUrl: require("../icons/home-button.png"),
    iconSize: [40, 40],
  });

  const [prefs, setPrefs] = useState([]);
  const [loadedData, setLoadedData] = useState();
  const [formData, setFormData] = useState({
    maritalStatus: "",
    salary: "",
    parentsAddress: { address: "", latitude: null, longitude: null },
    workplaceLocation: { address: "", latitude: null, longitude: null },
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(colRef, where("email", "==", auth.currentUser.email)),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("Creating document for user");
          addDoc(colRef, {
            email: auth.currentUser.email, // Accessing email property
          });
        } else {
          // Modified colRef, execute this code:
          let prefsData = [];
          snapshot.docs.forEach((doc) => {
            prefsData.push({ ...doc.data(), id: doc.id });
          });
          setPrefs(prefsData);
          setLoadedData({
            maritalStatus: prefsData[0].maritalStatus,
            salary: prefsData[0].salary,
            parentsAddress: {
              address: prefsData[0].parentsAddress
                ? prefsData[0].parentsAddress.address
                : "",
              latitude: prefsData[0].parentsAddress
                ? prefsData[0].parentsAddress.latitude
                : null,
              longitude: prefsData[0].parentsAddress
                ? prefsData[0].parentsAddress.longitude
                : null,
            },
            workplaceLocation: {
              address: prefsData[0].workplaceLocation
                ? prefsData[0].workplaceLocation.address
                : "",
              latitude: prefsData[0].workplaceLocation
                ? prefsData[0].workplaceLocation.address
                : null,
              longitude: prefsData[0].workplaceLocation
                ? prefsData[0].workplaceLocation.address
                : null,
            },
          });
          if (!prefsData) {
            if (prefsData[0].salary !== null) {
              setFormData((prevState) => ({
                ...prevState,
                salary: prefsData[0].salary,
              }));
            }
            if (prefsData[0].maritalStatus !== null) {
              setFormData((prevState) => ({
                ...prevState,
                maritalStatus: prefsData[0].maritalStatus,
              }));
            }
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value || value !== 0 || value !== "") {
      // Check if value is truthy, zero, or empty string
      setFormData({ ...formData, [name]: value });
    }
  };

  const addressUpdate = (type, homeLocation) => {
    console.log("geocoded", type, homeLocation);
    if (homeLocation != null) {
      if (type === "parentAddress") {
        setFormData((prevState) => ({
          ...prevState,
          parentsAddress: homeLocation,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          workplaceLocation: homeLocation,
        }));
      }
    }
  };

  const clearFields = () => {
    setFormData({
      maritalStatus: "",
      salary: "",
      parentsAddress: { address: "", latitude: null, longitude: null },
      workplaceLocation: { address: "", latitude: null, longitude: null },
    });
  };

  function check(loaded, form) {
    // Marital Status
    if (
      form.maritalStatus !== "" &&
      form.maritalStatus !== loaded.maritalStatus
    )
      return true;
    // Salary
    if (form.salary !== "" && form.salary !== loaded.salary) return true;
    // Parents Address
    if (form.parentsAddress.latitude !== null) return true;
    // Workplace Address
    if (form.workplaceLocation.latitude !== null) return true;
    return false;
  }

  const handleSubmit = async (e) => {
    console.log("pressed submit");
    e.preventDefault();
    const q = query(colRef, where("email", "==", auth.currentUser.email));

    const result = check(loadedData, formData);
    if (result) {
      // Initialize an object to store updated data
      let updatedData = {};

      // Iterate through formData to find changed fields
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const fieldValue = formData[key];
          if (key === "parentsAddress" || key === "workplaceLocation") {
            // For objects (addresses), check if the 'address' property is not empty
            if (fieldValue.address.trim() !== "") {
              // Field has value, add it to updatedData
              updatedData[key] = fieldValue;
            }
          } else {
            // For other fields, check if the value is not empty
            if (fieldValue && fieldValue.trim() !== "") {
              // Field has value, add it to updatedData
              updatedData[key] = fieldValue;
            }
          }
        }
      }

      try {
        // Continue with updating or adding document
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].ref;
          updateDoc(doc, updatedData)
            .then(() => {
              console.log("Updated User Preferences!");
              toast.success("Updated User Preferences!", {
                position: "top-center",
              });
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        } else {
          console.log("Creating document for user");
          const addData = { email: auth.currentUser.email, ...updatedData };
          addDoc(colRef, addData)
            .then(() => {
              console.log("Saved User Preferences!");
              toast.success("Saved User Preferences!", {
                position: "top-center",
              });
            })
            .catch((error) => {
              console.error("Error adding document:", error);
            });
        }
        setFormData((prevState) => ({
          ...prevState,
          parentsAddress: { address: "", latitude: null, longitude: null },
          workplaceLocation: { address: "", latitude: null, longitude: null },
        }));
      } catch (error) {
        console.error("Error submitting:", error);
      }
    }
  };

  const [parentAddressCenter, setParentAddressCenter] = useState([
    1.354, 103.825,
  ]); // Initialize center with default values
  const [workplaceAddressCenter, setWorkplaceAddressCenter] = useState([
    1.354, 103.825,
  ]); // Initialize center with default values

  useEffect(() => {
    if (prefs.length > 0 && prefs[0].workplaceLocation) {
      const { latitude, longitude } = prefs[0].workplaceLocation;
      setWorkplaceAddressCenter([latitude, longitude]);
    }
    if (prefs.length > 0 && prefs[0].parentsAddress) {
      const { latitude, longitude } = prefs[0].parentsAddress;
      setParentAddressCenter([latitude, longitude]);
    }
  }, [prefs]);

  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };

  return (
    <Container>
      <Toaster
        toastOptions={{
          style: { border: "2px green solid", background: "#D6EDD9" },
          duration: 1500,
        }}
        richColors
      />
      <h1>Manage Profile</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "5px" }}>
          <div style={{ marginBottom: "20px", marginTop: "15px" }}>
            <Typography variant="h7">
              Marital Status:{" "}
              {prefs[0] &&
                (prefs[0].maritalStatus
                  ? prefs[0].maritalStatus
                  : "Not specified")}
            </Typography>
          </div>
          <FormControl fullWidth>
            <InputLabel>Marital Status</InputLabel>
            <Select
              label="Marital Status"
              onChange={handleChange}
              value={formData.maritalStatus}
              name="maritalStatus"
              sx={{ mb: 2 }}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Typography variant="h7">
            Salary:{" "}
            {prefs[0] &&
              (prefs[0].salary ? "$" + prefs[0].salary : "Not specified")}
          </Typography>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <TextField
            variant="outlined"
            label="Salary"
            name="salary"
            type="number"
            onChange={handleChange}
            value={formData.salary}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: { min: 0 },
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <MapDialog
            type="parentsAddress"
            locationInfo={(homeLocation) =>
              addressUpdate("parentAddress", homeLocation)
            }
          />
        </div>
        <Typography style={{ marginBottom: "10px" }}>
          {formData.parentsAddress.address !== "" &&
            "New Parent's Address: " + formData.parentsAddress.address}
        </Typography>
        {prefs[0]?.parentsAddress && (
          <div style={{ marginBottom: "20px" }}>
            <Accordion
              sx={{ border: 1, borderColor: "silver", borderRadius: 1 }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
              >
                <Typography variant="h7">
                  Map of Parent's Address:{" "}
                  {prefs[0] &&
                    prefs[0].parentsAddress &&
                    prefs[0].parentsAddress.address}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MapContainer
                  center={[
                    prefs[0]?.parentsAddress?.address?.latitude || 1.354,
                    prefs[0]?.parentsAddress?.address?.longitude || 103.825,
                  ]}
                  zoom={18}
                  scrollWheelZoom={true}
                  style={{
                    height: "60vh",
                    width: "100%",
                    border: "4px LightSteelBlue solid",
                  }}
                >
                  {/* Google Map Tile Layer */}
                  <TileLayer
                    attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
                    layerName="mapLayer"
                  />
                  {/* This is for the parents marker */}
                  {parentAddressCenter && prefs[0]?.parentsAddress && (
                    <Marker
                      position={[
                        parentAddressCenter[0],
                        parentAddressCenter[1],
                      ]}
                      layerName="home"
                      icon={homeIcon}
                      draggable={false}
                    >
                      {/* Popup for home marker */}
                    </Marker>
                  )}
                  <RecenterAutomatically
                    lat={parentAddressCenter[0]}
                    lng={parentAddressCenter[1]}
                  />
                </MapContainer>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
        <div style={{ marginBottom: "5px" }}>
          <MapDialog
            type="workplaceAddress"
            locationInfo={(homeLocation) =>
              addressUpdate("workplaceAddress", homeLocation)
            }
          />
        </div>
        <Typography style={{ marginBottom: "10px" }}>
          {formData.workplaceLocation.address !== "" &&
            "New Workplace Address: " + formData.workplaceLocation.address}
        </Typography>
        {prefs[0]?.workplaceLocation && (
          <div style={{ marginBottom: "20px" }}>
            <Accordion
              sx={{ border: 1, borderColor: "silver", borderRadius: 1 }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
              >
                <Typography variant="h7">
                  Map of Workplace Address:{" "}
                  {prefs[0] &&
                    prefs[0].workplaceLocation &&
                    prefs[0].workplaceLocation.address}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MapContainer
                  center={[
                    workplaceAddressCenter[0] || 1.354,
                    workplaceAddressCenter[1] || 103.825,
                  ]}
                  zoom={18}
                  scrollWheelZoom={true}
                  style={{
                    height: "60vh",
                    width: "100%",
                    border: "4px LightSteelBlue solid",
                  }}
                >
                  {/* Google Map Tile Layer */}
                  <TileLayer
                    attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
                    layerName="mapLayer"
                  />
                  {/* This is for the workplace marker */}
                  {workplaceAddressCenter && prefs[0]?.workplaceLocation && (
                    <Marker
                      position={[
                        workplaceAddressCenter[0],
                        workplaceAddressCenter[1],
                      ]}
                      layerName="home"
                      icon={homeIcon}
                      draggable={false}
                    >
                      {/* Popup for home marker */}
                    </Marker>
                  )}
                  <RecenterAutomatically
                    lat={workplaceAddressCenter[0]}
                    lng={workplaceAddressCenter[1]}
                  />
                </MapContainer>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
        <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
          <Button
            variant="outlined"
            onClick={clearFields}
            sx={{ mr: 1, boxShadow: 1 }}
          >
            Clear Fields
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: 1, boxShadow: 1, backgroundColor: "#f7776b",
            "&:hover": { backgroundColor: "#c55f55" }, }}
          >
            Update Profile
          </Button>
          <DeleteAccountDialog />
        </Stack>
      </form>
    </Container>
  );
};

export default UserProfileForm;
