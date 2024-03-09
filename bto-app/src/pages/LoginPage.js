import { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from '../utils/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";


const LoginPage = ({ user }) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

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
    return <Navigate to="/home"></Navigate>;
  }
  
  return (
    <div className="login-page">
      <div className="navbar">
        <h1>Login page</h1>
      </div>
  
      <div className="welcome-section">
        <h1>Welcome to BTOgether</h1>
      </div>
  
      <div className="login-form">
        <form>
          {isSignUpActive && <legend>Sign Up</legend>}
          {!isSignUpActive && <legend>Sign In</legend>}
  
          <fieldset>
            <ul>
              <li>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" onChange={handleEmailChange} />
              </li>
              <li>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={handlePasswordChange}
                />
              </li>
            </ul>
  
            {isSignUpActive && (
              <button type="button" onClick={handleSignUp}>
                Sign Up
              </button>
            )}
            {!isSignUpActive && (
              <button type="button" onClick={handleSignIn}>
                Sign In
              </button>
            )}
          </fieldset>
  
          {isSignUpActive && <a onClick={handleMethodChange}>Login</a>}
          {!isSignUpActive && (
            <a onClick={handleMethodChange}>Dont have an account? Create an account here</a>
          )}
        </form>
      </div>
    </div>
  );  
};

export default LoginPage;