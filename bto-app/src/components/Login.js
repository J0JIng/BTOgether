import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import AuthGoogle from "../components/AuthGoogle";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../css/Login.css";

const Login = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
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
    <div className="login-box">
      {/* <form> */}
      {/* <legend>Sign In</legend> */}

      {/* <fieldset> */}
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
          className="password-input input"
          type="password"
          id="password"
          onChange={handlePasswordChange}
        />
      </div>

      <button className="sign-in-button" type="button" onClick={handleSignIn}>
        Sign In
      </button>
      {/* </fieldset> */}

      <div className="divider">
        <div className="continue">Or</div>
      </div>

      <AuthGoogle user={user} />
      {/* </form> */}
    </div>
  );
};

export default Login;
