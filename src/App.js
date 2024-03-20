import './App.css';
import { Auth } from './components/auth';
import { getFirestore, collection, addDoc, deleteDoc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import GeojsonMapComponent from "./components/GeojsonMapComponent";
import UserProfileForm from './components/userProfileForm';

var myHeaders = new Headers();
myHeaders.append("AccountKey", "++qZshXPQSea0zZRKDZgdw==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

function fetchBTO() {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Skip-Redirect': '1',
    },
    body: JSON.stringify({})
  };

  fetch("/home-api/public/v1/launch/getUpcomingProjects", requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the data here
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call the function wherever you need
fetchBTO();

function App() {

  // init services
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, 'User_prefs');
  const [prefs, setPrefs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      // Modified colRef, execute this code:
      let prefsData = [];
      snapshot.docs.forEach((doc) => {
        prefsData.push({ ...doc.data(), id: doc.id });
      });
      //console.log(prefsData)
      setPrefs(prefsData);
    });

    return () => unsubscribe();
  }, []);

  // Adding documents
  const addData = () => {
    const addPrefForm = document.querySelector('.add')
    addDoc(colRef, {
      email: addPrefForm.email.value,
      gender: addPrefForm.gender.value
    })
      .then(() => { addPrefForm.reset() })
  }

  // Delete document by email
  const deleteByEmail = () => {
    const deletePrefForm = document.querySelector('.delete')
    const email = deletePrefForm.email.value
    const q = query(colRef, where("email", "==", email));
    // Get the document snapshot
    getDocs(q)
      .then((snapshot) => {
        // Check if a document exists
        if (snapshot.empty) { alert("No document found with provided email"); return; }
        // Get the document reference from the first snapshot
        const doc = snapshot.docs[0].ref;
        // Delete the document
        deleteDoc(doc)
          .then(() => { deletePrefForm.reset(); console.log("Document deleted successfully!"); })
          .catch((error) => { console.error("Error updating document:", error); });
      })
      .catch((error) => { console.error("Error fetching documents:", error); });
  };

  // Update document
  const updateData = () => {
    const updatePrefForm = document.querySelector('.update')
    const email = updatePrefForm.oldemail.value
    const q = query(colRef, where("email", "==", email));

    getDocs(q)
      .then((snapshot) => {
        // Check if a document exists
        if (snapshot.empty) { alert("No document found with provided email"); return; }
        // Get the document reference from the first snapshot
        const doc = snapshot.docs[0].ref;
        // Update the document
        updateDoc(doc, {
          email: updatePrefForm.email.value,
          gender: updatePrefForm.gender.value
        }).then(() => { updatePrefForm.reset(); console.log("Document updated successfully!"); })
          .catch((error) => { console.error("Error updating document:", error); });
      })
      .catch((error) => { console.error("Error fetching documents:", error); });
  }

  return (
    <div className="App">

      {/* Map Div */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <GeojsonMapComponent />
      </div>

      <hr />
      {/* Auth Component */}
      <Auth />
      <hr />
      {/* Database Editing */}
      <h3>Add Data</h3>
      <form className='add' onSubmit={(e) => { e.preventDefault(); addData(); }}>
        <label htmlFor="email">Email: </label>
        <input type='text' name="email" required></input>
        <label htmlFor="gender" style={{ marginLeft: '10px' }}>Gender: </label>
        <input type='text' name="gender" required></input>
        <button style={{ marginLeft: '10px' }}>Add a new data</button>
      </form>

      <h3>Delete Data</h3>
      <form className='delete' onSubmit={(e) => { e.preventDefault(); deleteByEmail(); }}>
        <label htmlFor="email">Email: </label>
        <input type='text' name="email" required></input>
        <button style={{ marginLeft: '10px' }}>Delete data</button>
      </form>

      <h3>Update Data</h3>
      <form className='update' onSubmit={(e) => { e.preventDefault(); updateData(); }}>
        <label htmlFor="oldemail">Email: </label>
        <input type='text' name="oldemail" required></input>
        <label htmlFor="email" style={{ marginLeft: '10px' }}>New Email: </label>
        <input type='text' name="email" required></input>
        <label htmlFor="gender" style={{ marginLeft: '10px' }}>New Gender: </label>
        <input type='text' name="gender" required></input>
        <button style={{ marginLeft: '10px' }}>Update data</button>
      </form>
      <br />

      <hr />
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

      <hr />
      <UserProfileForm />

    </div>
  );
}

export default App;