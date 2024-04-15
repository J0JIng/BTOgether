import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import AuthGoogle from "../components/AuthGoogle";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../css/Register.css";

const SignUp = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!email || !password) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(error.message);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="register-box">
      <div className="email">
        <label className="email-label" htmlFor="email">
          Email
        </label>
        <input
          className="email-label input"
          type="text"
          id="email"
          onChange={handleEmailChange}
        />
      </div>

      <div className="password">
        <label className="password-label" htmlFor="password">
          Password
        </label>
        <input
          className="password-input login-input"
          type="password"
          id="password"
          onChange={handlePasswordChange}
        />
      </div>

      <button className="sign-in-button" type="button" onClick={handleSignUp}>
        Sign Up
      </button>

      <div className="divider">
        <div className="continue">Or</div>
      </div>

      <AuthGoogle user={user} />
    </div>
  );
};

export default SignUp;
