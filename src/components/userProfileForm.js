import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../utils/firebase';
import { getFirestore, collection, addDoc, updateDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { Button, Typography, FormControl, Input, InputLabel, FormHelperText, TextField, Select, MenuItem, Container, InputAdornment } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TileLayer, Marker, MapContainer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import MapDialog from './MapDialog';
import { Icon } from "leaflet";

const UserProfileForm = () => {
  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');
  const homeIcon = new Icon({ iconUrl: require("../icons/home-button.png"), iconSize: [40, 40] });

  const [prefs, setPrefs] = useState([]);

  const [formData, setFormData] = useState({
    maritalStatus: '',
    salary: '',
    parentsAddress: { address: '', latitude: null, longitude: null },
    workplaceLocation: { address: '', latitude: null, longitude: null }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(query(colRef, where("email", "==", auth.currentUser.email)), (snapshot) => {
      // Modified colRef, execute this code:
      let prefsData = [];
      snapshot.docs.forEach((doc) => {
        prefsData.push({ ...doc.data(), id: doc.id });
      });
      setPrefs(prefsData);
      console.log(prefsData[0])
      if (prefsData[0].salary != null) {
        setFormData(prevState => ({ ...prevState, salary: prefsData[0].salary }));
      }
      if (prefsData[0].maritalStatus != null) {
        setFormData(prevState => ({ ...prevState, maritalStatus: prefsData[0].maritalStatus }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value || value !== 0 || value !== '') { // Check if value is truthy, zero, or empty string
      setFormData({ ...formData, [name]: value });
    }
  };

  const addressUpdate = (type, homeLocation) => {
    console.log("geocoded", type, homeLocation);
    if (homeLocation != null) {
      if (type === 'parentAddress') {
        setFormData(prevState => ({ ...prevState, parentsAddress: homeLocation }));
      }
      else {
        setFormData(prevState => ({ ...prevState, workplaceLocation: homeLocation }));
      }
    }
  };

  const clearFields = () => {
    setFormData({
      maritalStatus: '',
      salary: '',
      parentsAddress: { address: '', latitude: null, longitude: null },
      workplaceLocation: { address: '', latitude: null, longitude: null }
    })
  };

  const handleSubmit = async (e) => {
    console.log("pressed submit");
    e.preventDefault();
    const q = query(colRef, where("email", "==", auth.currentUser.email));

    // Initialize an object to store updated data
    let updatedData = {};

    // Iterate through formData to find changed fields
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const fieldValue = formData[key];
        if (key === 'parentsAddress' || key === 'workplaceLocation') {
          // For objects (addresses), check if the 'address' property is not empty
          if (fieldValue.address.trim() !== '') {
            // Field has value, add it to updatedData
            updatedData[key] = fieldValue;
          }
        } else {
          // For other fields, check if the value is not empty
          if (fieldValue && fieldValue.trim() !== '') {
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
          .then(() => { console.log("Updated User Preferences!"); })
          .catch((error) => { console.error("Error updating document:", error); });
      } else {
        console.log("Creating document for user");
        const addData = { email: auth.currentUser.email, ...updatedData };
        addDoc(colRef, addData)
          .then(() => { console.log("Saved User Preferences!"); })
          .catch((error) => { console.error("Error adding document:", error); });
      }
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  const [parentAddressCenter, setParentAddressCenter] = useState([1.354, 103.825]); // Initialize center with default values
  const [workplaceAddressCenter, setWorkplaceAddressCenter] = useState([1.354, 103.825]); // Initialize center with default values

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
  }

  return (
    <Container>
      <h1>Manage Profile</h1>
      <hr />
      <br />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '5px' }}>
          <FormControl fullWidth>
            <InputLabel>Marital Status</InputLabel>
            <Select
              label="Marital Status"
              onChange={handleChange}
              value={formData.maritalStatus}
              name="maritalStatus"
              sx={{ mb: 2 }}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <TextField
            variant='outlined'
            label="Salary"
            name='salary'
            type="number"
            onChange={handleChange}
            value={formData.salary}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </div>
        <div style={{ marginBottom: '5px' }}>
          <MapDialog type="parentsAddress" locationInfo={(homeLocation) => addressUpdate("parentAddress", homeLocation)} />
        </div>
        <Typography style={{ marginBottom: '10px' }}>
          {formData.parentsAddress.address!='' && "New Parent's Address: " + formData.parentsAddress.address}
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <Accordion sx={{ border: 1, borderColor: 'silver', borderRadius: 1 }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content">
              <Typography variant='h7'>Map of Parent's Address: {prefs[0] && prefs[0].parentsAddress && prefs[0].parentsAddress.address}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MapContainer
                center={[
                  prefs[0]?.parentsAddress?.address?.latitude || 1.354,
                  prefs[0]?.parentsAddress?.address?.longitude || 103.825
                ]}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '60vh', width: '100%', border: '4px LightSteelBlue solid' }}
              >
                {/* Google Map Tile Layer */}
                <TileLayer
                  attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                  url='https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
                  layerName='mapLayer'
                />
                {/* This is for the parents marker */}
                {parentAddressCenter && (
                  <Marker position={[parentAddressCenter[0], parentAddressCenter[1]]} layerName="home" icon={homeIcon} draggable={false}>
                    {/* Popup for home marker */}
                  </Marker>
                )}
                <RecenterAutomatically lat={parentAddressCenter[0]} lng={parentAddressCenter[1]} />
              </MapContainer>
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <MapDialog type="workplaceAddress" locationInfo={(homeLocation) => addressUpdate("workplaceAddress", homeLocation)} />
        </div>
        <Typography style={{ marginBottom: '10px' }}>
          {formData.workplaceLocation.address!='' && "New Workplace Address: " + formData.workplaceLocation.address}
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <Accordion sx={{ border: 1, borderColor: 'silver', borderRadius: 1 }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content">
              <Typography variant='h7'>Map of Workplace Address: {prefs[0] && prefs[0].workplaceLocation && prefs[0].workplaceLocation.address}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MapContainer
                center={[
                  workplaceAddressCenter[0] || 1.354,
                  workplaceAddressCenter[1] || 103.825
                ]}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '60vh', width: '100%', border: '4px LightSteelBlue solid' }}
              >
                {/* Google Map Tile Layer */}
                <TileLayer
                  attribution='Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
                  url='https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
                  layerName='mapLayer'
                />
                {/* This is for the workplace marker */}
                {workplaceAddressCenter && (
                  <Marker position={[workplaceAddressCenter[0], workplaceAddressCenter[1]]} layerName="home" icon={homeIcon} draggable={false}>
                    {/* Popup for home marker */}
                  </Marker>
                )}
                <RecenterAutomatically lat={workplaceAddressCenter[0]} lng={workplaceAddressCenter[1]} />
              </MapContainer>
            </AccordionDetails>
          </Accordion>
        </div>
        <Button variant="outlined" onClick={clearFields} sx={{ mr: 1, boxShadow: 1 }}>Clear Fields</Button>
        <Button type="submit" variant="contained">Update Profile</Button>
      </form>

      {/* Display Database Contents */}
      <h2 style={{ marginBottom: '5px' }}>My Saved Profile</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {prefs && prefs.length > 0 && (
          <table style={{ borderCollapse: 'collapse', border: '1px solid black', padding: '2px' }}>
            <thead>
              <tr>
                {Object.keys(prefs[0]).map((key) => (
                  <th style={{ border: '1px solid black', padding: '2px' }} key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prefs.map((pref) => (
                <tr key={pref.id}>
                  {Object.keys(pref).map((key) => (
                    <td style={{ border: '1px solid black', padding: '5px' }} key={key}>
                      {/* Check if the value is not null, undefined, or an empty string */}
                      {pref[key] !== null && pref[key] !== undefined && pref[key] !== '' ? (
                        // Check if the value is an object
                        typeof pref[key] === 'object' ? (
                          // Render specific properties of the object
                          <div>
                            <p>Latitude: {pref[key].latitude}</p>
                            <p>Longitude: {pref[key].longitude}</p>
                            <p>Address: {pref[key].address}</p>
                          </div>
                        ) : (
                          // Render the value directly if it's not an object
                          pref[key]
                        )
                      ) : null /* or any other fallback value */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </Container>

  );
}

export default UserProfileForm;