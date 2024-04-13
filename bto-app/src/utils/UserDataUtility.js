import React, { useEffect, forwardRef } from "react";
import { Button } from "@mui/material";
import { auth } from "./firebase";
import { query, where } from "firebase/firestore";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";

/**
 * A utility component for managing user data in Firestore.
 * It provides functions to save and load user preferences.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.saveData - An object that will be saved by UserDataUtility.
 * @param {Function} props.loadedData - A function to receive loaded user data.
 * @param {React.RefObject} ref - The ref forwarded to the outermost element. 
 * Use 'useRef' in parent components to reference this component
 * @returns {JSX.Element} A JSX element representing the UserDataUtility component.
 * 
 * Create the component in this manner in a parent function
 * <UserDataUtility ref={dataUtilityRef} saveData={dataToBeSaved} loadedData={handleLoadedData} />
 * 
 * To save data, in the parent component, call ref.current.saveUserData(). 
 * The object placed into props.saveData will be saved into Firestore
 * 
 * To load data, in the parent component, call ref.current.loadUserData(). 
 * The loaded data will be available in the function passed in prop.loadedData() as 'data'. For example:
 * const handleLoadedData = (data) => {
    if (data) {
      console.log("Loaded from firestore:", data);
      setLoadedData(data);
    } else {
      console.log("No data found"); 
    }
  };
 * 
 */

const UserDataUtility = forwardRef(({ saveData, loadedData }, ref) => {
  const db = getFirestore();
  // Users_pref collection ref
  const colRef = collection(db, "User_prefs");
  const user = auth.currentUser;
  const email = user.email;
  const q = query(colRef, where("email", "==", email));

  const handleSaveData = async () => {
    console.log("saving data");
    console.log("saving ", saveData);

    try {
      // Continue with updating or adding document
      const snapshot = await getDocs(q);
      let updatedData = {}; // Initialize object to store updated data

      // Iterate over properties of saveData and add them to updatedData
      for (const field in saveData) {
        if (saveData.hasOwnProperty(field)) {
          updatedData[field] = saveData[field];
        }
      }

      if (!snapshot.empty) {
        const doc = snapshot.docs[0].ref;
        updateDoc(doc, updatedData)
          .then(() => {
            console.log("Updated User Preferences!");
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
          })
          .catch((error) => {
            console.error("Error adding document:", error);
          });
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const handleLoadData = async () => {
    console.log("loading data");
    try {
      // Continue with updating or adding document
      const snapshot = await getDocs(q);
      const data = snapshot.docs[0].data();
      loadedData(data);
    } catch (error) {
      console.error("Error loading data:", error);
      loadedData(null);
    }
  };

  // Forward ref to the outermost element
  useEffect(() => {
    if (ref) {
      ref.current = {
        saveUserData: handleSaveData,
        loadUserData: handleLoadData,
      };
    }
  }, [ref, handleSaveData, handleLoadData]);
});

export default UserDataUtility;
