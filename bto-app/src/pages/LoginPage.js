import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login'; 
import Register from '../components/Register'; 
import AuthGoogle from '../components/AuthGoogle';


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
      
      <div className="navbar">
        <h1>Login page</h1>
      </div>

      <div className="welcome-section">
        <h1>Welcome to BTOgether</h1>
      </div>

      <div className="login-form">

      `  {isSignUpActive ? (
            <Register user={user} handleMethodChange={handleMethodChange} />
          ) : (
            <Login user={user} handleMethodChange={handleMethodChange} />
          )}`  

          <AuthGoogle user={user}/>

      </div>

      {isSignUpActive && <a onClick={handleMethodChange}>Login</a>}
      {!isSignUpActive && (<a onClick={handleMethodChange}>Dont have an account? Create an account here</a>)}

    </div>
  );
};

export default LoginPage;
