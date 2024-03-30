import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const SignOut = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };
  return (
    <section>
      <button onClick={handleSignOut}>Sign Out</button>
    </section>
  );
};

export default SignOut;