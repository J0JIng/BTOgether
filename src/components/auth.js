import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heading, setHeading] = useState("");

  // To set Heading when auth is finished initializing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setHeading(user ? "Welcome back " + user.email : "Please Sign In/Register");
    });

    return () => unsubscribe(); // Cleanup function to avoid memory leaks
  }, []);

  // Register Users
  const register = async () => {
    if (!auth.currentUser) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        setHeading("Welcome to ApartMate " + auth.currentUser.email);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          alert("The email address is already in use");
        } else if (err.code === "auth/invalid-email") {
          alert("The email address is not valid.");
        } else if (err.code === "auth/operation-not-allowed") {
          alert("Operation not allowed.");
        } else if (err.code === "auth/weak-password") {
          alert("The password is too weak.");
        }
      }
    }
  };

  // User Sign In
  const signin = async () => {
    if (!auth.currentUser) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        setHeading("Welcome back " + auth.currentUser.email + "!");
      } catch (err) {
        console.log(err);
      }
    }
  };

  // User Log Out
  const logout = async () => {
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <br />
      <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password..." type="password" 
              style={{ marginLeft: '10px' }} 
              onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register} style={{ marginLeft: '10px' }}>Register</button>
      <button onClick={signin} style={{ marginLeft: '10px' }}>Sign In</button>
      <button onClick={logout} style={{ marginLeft: '10px' }}>Sign Out</button>
      <h1>{heading}</h1>
    </div>
  );
}