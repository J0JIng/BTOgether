import './App.css';
import { Auth } from './components/auth';
import { getFirestore, collection, addDoc, deleteDoc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import PaginationComponent from './components/PaginationComponent';
import GeojsonDataComponent from "./components/GeojsonDataComponent";
import gymgeojson from "./geojson/GymsSGGEOJSON.geojson";
import hawkergeojson from "./geojson/HawkerCentresGEOJSON.geojson";



var myHeaders = new Headers();
myHeaders.append("AccountKey", "++qZshXPQSea0zZRKDZgdw==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

function formatTime(timestamp) {
  // Implement your desired time formatting logic here
  return new Date(timestamp).toLocaleTimeString();
}

function App() {
  const [busServices, setBusServices] = useState([])
  const [busStopCode, setBusStopCode] = useState(''); // Initial value
  const [chosenJson, setChosenJson] = useState(gymgeojson);

  // Get bus times
  useEffect(() => {
    if (/^\d{1,5}$/.test(busStopCode.trim())) { // Check if busStopCode is 1-5 digits
      const getBusTime = async () => {
        try {
          const response = await fetch(`/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, requestOptions);
          const data = await response.json(); // Parse JSON response
          setBusServices(data.Services);
        } catch (error) {
          console.log(error);
        }
      };
      getBusTime();
    }
  }, [busStopCode]);

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
      console.log(prefsData)
      setPrefs(prefsData);
    });

    return () => unsubscribe();
  }, []);

  // Adding documents
  const addData = () => {
    const addPrefForm = document.querySelector('.add')
    addDoc(colRef, {
      email: addPrefForm.email.value,
      gender: addPrefForm.gender.value,
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
          gender: updatePrefForm.gender.value,
        }).then(() => { updatePrefForm.reset(); console.log("Document updated successfully!");})
          .catch((error) => { console.error("Error updating document:", error); });
      })
      .catch((error) => { console.error("Error fetching documents:", error); });
  }

  const toggleJson = () => {
    if (chosenJson === gymgeojson) {
      setChosenJson(hawkergeojson)
    } else setChosenJson(gymgeojson)
  }
  
  return (
    <div className="App">
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px'}}>
      <GeojsonDataComponent filePath={chosenJson}/>
    </div>
    <button onClick={toggleJson}>Change Json</button>

    <Auth />

    <PaginationComponent />
    
    <h3>Add Data</h3>
    <form className='add' onSubmit={(e) => { e.preventDefault(); addData(); }}>
      <label htmlFor="email">Email: </label>
      <input type='text' name="email" required></input>
      <label htmlFor="gender" style={{ marginLeft: '10px' }}>Gender: </label>
      <input type='text' name="gender" required></input>
      <button style={{ marginLeft: '10px'}}>Add a new data</button>
    </form>

    <h3>Delete Data</h3>
    <form className='delete' onSubmit={(e) => { e.preventDefault(); deleteByEmail(); }}>
      <label htmlFor="email">Email: </label>
      <input type='text' name="email" required></input>
      <button style={{ marginLeft: '10px'}}>Delete data</button>
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
    
    <h2 style={{ marginBottom: '5px'}}>List of Users Preferences</h2>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px'}}>
    <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {prefs.map((pref) => (
            <tr key={pref.id}>
              <td>{pref.email}</td>
              <td>{pref.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <label>Enter Bus Stop Code: </label>
    <input type="text" value={busStopCode} onChange={(event) => setBusStopCode(event.target.value)}/>
    <br />

    <h3 style={{ marginBottom: '0px'}}>Bus Arrival Times</h3>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <ul>
    <table>
      <thead>
        <tr>
          <th>Service Number</th>
          <th>Next Bus</th>
          <th>Second Bus</th>
          <th>Third Bus</th>
        </tr>
      </thead>
      <tbody>
        {busServices.map((service) => (
          <tr key={service.ServiceNo}>
            <td>{service.ServiceNo}</td>
            <td>{formatTime(service.NextBus.EstimatedArrival)}</td>
            <td>{formatTime(service.NextBus2.EstimatedArrival)}</td>
            <td>{formatTime(service.NextBus3.EstimatedArrival)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </ul>
    </div>
    
    </div>
    );
  }
  
  export default App;