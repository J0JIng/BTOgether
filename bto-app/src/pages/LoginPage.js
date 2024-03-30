import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login'; 
import Register from '../components/Register'; 
import AuthGoogle from '../components/AuthGoogle';
import styled from 'styled-components';


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

      <div className="login-page-wrapper">

      `  {isSignUpActive ? (
            <Register user={user} handleMethodChange={handleMethodChange} />
          ) : (
            <Login user={user} handleMethodChange={handleMethodChange} />
          )}`  

          <AuthGoogle user={user}/>

      </div>

      {isSignUpActive && <a onClick={handleMethodChange}>Login</a>}
      {!isSignUpActive && (<a onClick={handleMethodChange}>Dont have an account? Create here</a>)}

    </div>
  );
};

export default LoginPage;


/*

import { Link } from "react-router-dom";
import styled from 'styled-components';

const LoginPageContainer = styled.div`
  background-color: rgb(249, 250, 251);
  font-family: 'Inter', Helvetica, Arial, sans-serif;
`;

const TopBox = styled.div`
  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background-color: #f7776b;
  border-radius: 10px;
  height: 35px;
  font-size: 20px;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  min-width: 350px;

  .app-logo {
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    }
  }

  .options {
    width: 200px;
    display: flex;
    justify-content: space-evenly;

    a {
      text-decoration: none;
      color: rgb(124, 38, 27);
      padding: 4px;
      border-bottom: 2px solid transparent;

      &:hover {
        color: white;
        cursor: pointer;
        transition-duration: 0.2s;
      }
    }
  }
`;

const TitleAndBox = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
`;

const TitleAndSignUp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(55, 65, 81);

  .register-link {
    color: rgb(55, 65, 81);
    &:hover {
      color: rgb(55, 65, 81);
      text-decoration: none;
      transition-duration: 0.2s;
    }
  }
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 30px;
  color: rgb(55, 65, 81);
  min-width: 350px;
`;


const LoginBox = styled.div`
    background-color: white;
    min-height: 384px;
    min-width: 376px;
    padding: 32px;

    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    .sign-in-button {
        margin-top: 30px;
        height: 35px;
        
        border-width: 0px;
        border: 2px solid transparent;
        background-color: #f7776b;
        border-radius: 6px;
        
        color: rgb(124, 38, 27);
        color: white; 

        &:hover {
            border: 2px solid rgb(124, 38, 27);
            cursor: pointer;
            transition-duration: 0.2s;
        }
    }

    .continue {
        color: rgb(55, 65, 81, 0.8);
        font-size: smaller;
        position: relative;
    }
`;

const Email = styled.div`
    display: flex;
    flex-direction: column;

    gap: 10px;
    
    label {
        color: #f7776b;
        font-weight: 700;
    }

    input {
        border: 1px solid #ccc;
        border-color: rgb(194, 194, 194);
        border-radius: 0.375rem;

        padding: 16px 12px;
        outline: none;

        &:focus {
            border-color: #f7776b;
        }
    }

`;
const Password = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    
    gap: 10px;

    label {
        color: #f7776b;
        font-weight: 700;
    }

    input {
        border: 1px solid #ccc;
        border-color: rgb(194, 194, 194);
        border-radius: 0.375rem;

        padding: 16px 12px;
        outline: none;

        &:focus {
            border-color: #f7776b;
        }
    }
`;

const GoogleButton = styled.button`
    margin-top: 30px;

transition: background-color .3s, box-shadow .3s;
  
padding: 12px 16px 12px 42px;
border: none;
border-radius: 3px;
box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);

color: #757575;
font-size: 14px;
font-weight: 500;
font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;

background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
background-color: white;
background-repeat: no-repeat;
background-position: 12px 11px;

&:hover {
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .10), 0 2px 4px rgba(0, 0, 0, .25);
}

&:active {
  background-color: #eeeeee;
}

&:focus {
  outline: none;
  box-shadow: 
    0 -1px 0 rgba(0, 0, 0, .04),
    0 2px 4px rgba(0, 0, 0, .25),
    0 0 0 3px #c8dafc;
}

&:disabled {
  filter: grayscale(100%);
  background-color: #ebebeb;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
  cursor: not-allowed;
}

`

const LoginPage = () => {
    return ( 
        <LoginPageContainer>
            <TopBox>
                <img src="/bto-app/src/images/btodraftlogo.png" className="app-logo" style={{width: '60px', height: '60px', borderRadius: '5px'}} />
                <div className="options">
                    <a className="homepage-link" href>Homepage</a>
                    <a className="login-link" href>Login</a>
                </div>
            </TopBox>
            
            <TitleAndBox>
                <TitleAndSignUp>
                    <Title>Sign in to your account</Title>
                    <p className="register-prefix">Or <a className="register-link" href="#">sign up for a new account</a></p>
                </TitleAndSignUp>

                <LoginBox>
                    <Email>
                        <label className="email-label" htmlFor="email">Email address</label>
                        <input className="email-input input" type="email" id="email" name="email" required />
                    </Email>
                    <Password>
                        <label className="password-label" htmlFor="password">Password</label>
                        <input className="password-input input" type="password" id="password" name="password" required />
                    </Password>

                    <button className="sign-in-button">Sign in</button>
                    
                    <div className="divider">
                        <div className="continue">Or continue with</div>
                    </div>
                    <GoogleButton>
                        Sign in with Google
                    </GoogleButton>
                </LoginBox>
            </TitleAndBox>
        </LoginPageContainer>

        
      
        
        // <div className="navbar">
        //     <h1>Hello Login page</h1>
        //     <Link to ='/home'>Authenticate</Link>
        // </div>
    );
}
 
export default LoginPage;

*/