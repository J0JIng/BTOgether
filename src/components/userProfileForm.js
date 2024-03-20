import React, { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { getFirestore, collection, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import axios from 'axios'; // Import axios

const UserProfileForm = () => {
  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');
  const [errorMessage, setErrorMessage] = useState(''); // Define errorMessage state

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
    <div>
      <h3>User Preferences</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Marital Status:
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </label>
        <br />
        <label>
          Salary:
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
        </label>
        <br />
        <label>
          Parents Address:
          <input name="parentsAddress" value={formData.parentsAddress} onChange={handleChange} />
        </label>
        <br />
        <label>
          Workplace Location:
          <input name="workplaceLocation" value={formData.workplaceLocation} onChange={handleChange} />
        </label>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <br />
        <button type="submit">Submit</button>
        <br/>
        <br/>
      </form>
    </div>
  );
}

export default UserProfileForm;
