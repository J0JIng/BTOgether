import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <div className="register-form">
        <form>
          <legend>Sign Up</legend>

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

            <button type="button" onClick={handleSignUp}>
              Sign Up
            </button>
          </fieldset>
        </form>
      </div>
  );
};

export default SignUp;
