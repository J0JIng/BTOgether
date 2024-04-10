import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { auth } from "../utils/firebase";
import { query, where } from "firebase/firestore";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(); // Define errorMessage state

  const handleClickOpen = () => {
    setOpen(true);
    setErrorMessage();
    setPassword("")
  };

  const handleCancel = () => {
    console.log("cancel delete account");
    setOpen(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const deleteAccount = () => {
    const user = auth.currentUser;

    const authInstance = getAuth();
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(authInstance.currentUser, credential)
      .then(() => {
        // User reauthenticated successfully, proceed to delete account
        user.delete()
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
            console.log("User Account Deleted Successfully");
            setOpen(false);
          })
          .catch((error) => {
            // An error occurred while deleting the account
            console.error("Error deleting account:", error);
          });
      })
      .catch((error) => {
        // Reauthentication failed, handle error
        console.error("Error reauthenticating:", error);
        setErrorMessage(
          "Incorrect Password. Please try again"
        );
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
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={password}
            error={errorMessage != null}
            helperText={errorMessage ? errorMessage : null}
            onChange={handlePasswordChange}
          />
          <p>This action cannot be undone. Press the Red Button to Confirm Account Deletion</p>
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
