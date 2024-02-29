import LoginPage from '../pages/LoginPage';
import {Link} from 'react-router-dom';

import {
  login,
  aboutUs,
  faqsTabName,
  spinalCase,
} from "../utils/pageConstants";

const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>BTOgether</h1>
        <div className="links">
          <Link to = {spinalCase(aboutUs)} >about Us</Link>
          <Link to = {spinalCase(faqsTabName)} >FAQs</Link>
          <Link to = "/">Log Out</Link>
        </div>
      </nav>
    );
  }
   
  export default Navbar;