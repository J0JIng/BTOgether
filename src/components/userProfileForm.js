import React, { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { getFirestore, collection, addDoc, updateDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import axios from 'axios'; // Import axios
import { Button, Typography, FormControl, Input, InputLabel, FormHelperText, TextField, Select, MenuItem, Container, InputAdornment } from '@mui/material';

const UserProfileForm = () => {
  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');
  const [errorMessage, setErrorMessage] = useState(''); // Define errorMessage state

  const [prefs, setPrefs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      // Modified colRef, execute this code:
      let prefsData = [];
      snapshot.docs.forEach((doc) => {
        prefsData.push({ ...doc.data(), id: doc.id });
      });
      console.log(prefsData)
      setPrefs(prefsData);
    });

    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    maritalStatus: '',
    salary: '',
    parentsAddress: '',
    workplaceLocation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value || value !== 0 || value !== '') { // Check if value is truthy, zero, or empty string
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (formData.parentsAddress === '' || formData.workplaceLocation === '') {
      setErrorMessage('')
    }
  }, [formData.parentsAddress, formData.workplaceLocation])

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
        if (fieldValue && fieldValue.trim() !== '') {
          // Field has value, add it to updatedData
          updatedData[key] = fieldValue;
        }
      }
    }

    // Check if any field is updated
    if (Object.keys(updatedData).length === 0) {
      setErrorMessage('Please provide either Parents Address or Workplace Location.');
      return;
    }

    try {
      // Geocode the address for each updated field
      for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key) && (key === 'parentsAddress' || key === 'workplaceLocation')) {
          console.log(key)
          const addressToGeocode = updatedData[key];
          const geocodedAddress = await geocodeAddress(addressToGeocode);
          if (geocodedAddress === null) {
            setErrorMessage('Error geocoding Parents or Workplace Address')
            // Remove the key from updatedData
            delete updatedData[key];
          } else {
            updatedData[key] = geocodedAddress; // Replace address with geocoded data
          }
        }
      }

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
      setErrorMessage('Error geocoding address');
      console.error('Error geocoding address:', error);
    }

  };

  // Function to geocode the address
  const geocodeAddress = async (address) => {
    try {
      const geocodingResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`);
      if (geocodingResponse.data.length > 0) {
        const { lat, lon } = geocodingResponse.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road = geocodingResponse.data[0].address.road || geocodingResponse.data[0].address.suburb || geocodingResponse.data[0].address.postcode;

        const singaporeBounds = {
          north: 1.5, south: 1.1, east: 104.1, west: 103.6
        };

        if (
          latitude >= singaporeBounds.south &&
          latitude <= singaporeBounds.north &&
          longitude >= singaporeBounds.west &&
          longitude <= singaporeBounds.east
        ) {
          return {
            latitude,
            longitude,
            road
          };
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
    return null; // Return null if geocoding fails
  };

  return (
    <Container>
      <h1>Manage Profile</h1>
      <hr />
      <br />
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
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
        <div style={{ marginBottom: '20px' }}>
          <TextField
            variant='outlined'
            label="Salary"
            name='salary'
            onChange={handleChange}
            value={formData.salary}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            variant='outlined'
            label="Parent's Address"
            name="parentsAddress"
            onChange={handleChange}
            value={formData.parentsAddress}
            fullWidth
            sx={{ mb: 2 }}
            error={errorMessage}
            helperText={errorMessage ? errorMessage : ''}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            variant='outlined'
            label="Workplace Address"
            name="workplaceLocation"
            onChange={handleChange}
            value={formData.workplaceLocation}
            fullWidth
            sx={{ mb: 2 }}
            error={errorMessage}
            helperText={errorMessage ? errorMessage : ''}
          />
        </div>
        {/*errorMessage && <p style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</p>*/}
        <Button type="submit" variant="contained">Update Profile</Button>
      </form>

      {/* Display Database Contents */}
      <h2 style={{ marginBottom: '5px' }}>List of Users Preferences</h2>
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
                      {pref[key] !== null && pref[key] !== undefined && pref[key] !== '' &&
                        // Check if the value is an object
                        typeof pref[key] === 'object' &&
                        // Check if the object has specific keys (longitude, latitude, road)
                        'longitude' in pref[key] && 'latitude' in pref[key] && 'road' in pref[key] ? (
                        <div>
                          <p>Latitude: {pref[key].latitude}</p>
                          <p>Longitude: {pref[key].longitude}</p>
                          <p>Road: {pref[key].road}</p>
                        </div>
                      )
                        : // Render the value directly if it's not an object with specific keys
                        pref[key]}
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
