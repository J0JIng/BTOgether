import { Navigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import "../css/AuthGoogle.css";

const AuthGoogle = ({ user }) => {
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(error.message);
      });
  };

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <button className="login-with-google-btn" onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default AuthGoogle;
