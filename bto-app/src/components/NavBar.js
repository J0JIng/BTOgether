import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import btoLogo from "../assets/btodraftlogo.png";
import {
  spinalCase,
  aboutUs,
  faqsTabName,
  profile,
  dashboard,
  btofind,
  btoplanner,
} from "../utils/pageConstants";
import "../css/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${menuOpen ? "open" : ""}`}>
      <Link to="/home">
        <div className="logo-image">
          <img
            src={btoLogo}
            alt="bto-logo"
            style={{ width: "60px", height: "60px", borderRadius: "5px" }}
          />
        </div>
      </Link>

      <div className="title-heading">BTOgether</div>

      <div className="menu" onClick={toggleMenu}>
        =
      </div>

      <div className={`links ${menuOpen ? "open" : ""}`}>
        <Link to={spinalCase(aboutUs)}>About Us</Link>
        <Link to={spinalCase(profile)}>Profile</Link>
        <Link to={spinalCase(dashboard)}>Dashboard</Link>
        <Link to={spinalCase(btofind)}>BTO Find</Link>
        <Link to={spinalCase(btoplanner)}>BTO Planner</Link>
        <a onClick={handleSignOut}>Sign Out</a>
      </div>
    </nav>
  );
};
export default Navbar;
