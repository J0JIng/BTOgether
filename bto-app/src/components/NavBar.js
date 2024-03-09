import {Link} from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

import {
  login,
  aboutUs,
  faqsTabName,
  spinalCase,
  profile,
  dashboard,
  btofind,
  btoplanner,
} from "../utils/pageConstants";


const Navbar = () => {

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

    return (
      <nav className="navbar">
        <h1>BTOgether</h1>
        <div className="links">
          <Link to = {spinalCase(aboutUs)} >About Us</Link>
          <Link to = {spinalCase(faqsTabName)} >FAQs</Link>
          <Link to = {spinalCase(profile)} >Profile</Link>
          <Link to = {spinalCase(dashboard)} >Dashboard</Link>
          <Link to = {spinalCase(btofind)} >BTO Find</Link>
          <Link to = {spinalCase(btoplanner)} >BTO Planner</Link>
          <a onClick={handleSignOut}>Sign Out</a>
        </div>
      </nav>
    );
  }
   
  export default Navbar;