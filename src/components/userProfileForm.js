import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { getFirestore, collection, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';

const UserProfileForm = () => {
  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');

  const [formData, setFormData] = useState({
    maritalStatus: '',
    salary: '',
    parentsAddress: '',
    workplaceLocation: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value || value === 0 || value === '') { // Check if value is truthy, zero, or empty string
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query(colRef, where("email", "==", auth.currentUser.email));
  
    getDocs(q)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0].ref;
          const updateData = {};
          for (const [key, value] of Object.entries(formData)) {
            if (value || value === 0) { // Check if value is truthy or zero
              updateData[key] = value;
            }
          }
          updateDoc(doc, updateData)
            .then(() => { console.log("Updated User Preferences!"); })
            .catch((error) => { console.error("Error updating document:", error); });
        } else {
          console.log("Creating document for user");
          const addData = {
            email: auth.currentUser.email // Accessing email property
          };
          for (const [key, value] of Object.entries(formData)) {
            if (value || value === 0) { // Check if value is truthy or zero
              addData[key] = value;
            }
          }
          addDoc(colRef, addData)
            .then(() => { console.log("Saved User Preferences!"); })
            .catch((error) => { console.error("Error adding document:", error); });
        }
      })
      .catch((error) => { console.error("Error fetching document:", error); });
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
        <br />
        <button type="submit">Submit</button>
        <br/>
        <br/>
      </form>
    </div>
  );
}

export default UserProfileForm;
