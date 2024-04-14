import { useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import AuthGoogle from "../components/AuthGoogle";
import btoLogo from "../assets/btodraftlogo.png";
import "../css/loginpage.css";
import "../css/Login.css";

const LoginPage = ({ user }) => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-page">
      <div className="top-box">
        <img
          src={btoLogo}
          className="app-logo"
          style={{ width: "60px", height: "60px", borderRadius: "5px" }}
        />
        <div className="title-heading-login-page">BTOgether</div>
      </div>

      <div className="title-and-box">
        <div className="title-and-sign-up">
          <div className="title">Welcome to BTOgether</div>
          {isSignUpActive && (
            <a className="loginpage redirect" onClick={handleMethodChange}>
              Have an account? Login here
            </a>
          )}
          {!isSignUpActive && (
            <a className="registerpage redirect" onClick={handleMethodChange}>
              Don't have an account? Register here
            </a>
          )}
        </div>

        <div className="login-page-wrapper">
          {isSignUpActive ? (
            <Register user={user} handleMethodChange={handleMethodChange} />
          ) : (
            <Login user={user} handleMethodChange={handleMethodChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
