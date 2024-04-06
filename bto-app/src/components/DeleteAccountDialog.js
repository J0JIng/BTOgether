import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth } from "../utils/firebase";
import { query, where } from "firebase/firestore";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    console.log("cancel delete account");
    setOpen(false);
  };

  const deleteAccount = () => {
    const user = auth.currentUser;
    user
      .delete()
      .then(() => {
        // User deleted.
        const db = getFirestore();
        // Users_pref collection ref
        const colRef = collection(db, "User_prefs");
        const email = user.email;
        const q = query(colRef, where("email", "==", email));
        // Get the document snapshot
        getDocs(q)
          .then((snapshot) => {
            // Check if a document exists
            if (snapshot.empty) {
              alert("No document found with provided email");
              return;
            }
            // Get the document reference from the first snapshot
            const doc = snapshot.docs[0].ref;
            // Delete the document
            deleteDoc(doc)
              .then(() => {
                console.log("Document deleted successfully!");
              })
              .catch((error) => {
                console.error("Error updating document:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching documents:", error);
          });
        console.log("User Account Deleted Successful");
        setOpen(false);
      })
      .catch((error) => {
        // An error occurred
        // ...
        console.log(error); // Log the error message
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="error"
        sx={{ mr: 1, boxShadow: 1 }}
        startIcon={<DeleteIcon />}
      >
        Delete Account
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          This action cannot be undone. Press the Red Button to Confirm Account
          Deletion
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{ boxShadow: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={deleteAccount}
            variant="contained"
            color="error"
            sx={{ boxShadow: 1 }}
            startIcon={<DeleteIcon />}
          >
            Confirm Account Deletion
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
