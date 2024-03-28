import { Link } from "react-router-dom";
import '../css/entrypage.css';
import btoLogo from '../assets/btodraftlogo.png';
import btoimage from '../assets/hdbdraftimage1.jpg';

const EntryPage = () => {
    return (  
        <div className="entry-page">

            <div className="logo-image">
                <img src={btoLogo} alt="bto-logo" style={{ width: '60px', height: '60px', borderRadius: '5px' }} />
            </div>
            
            <div className="title-heading">
                BTOgether
            </div>

            <div className="container">
                <img src={btoimage} alt="bto-image" className="image-style" />
            </div>

            <div className="heading-box">
                {/* You can add any heading box content here if needed */}
            </div>

            <div className="page-info">
                <div className="desc-heading">
                    What we do:
                </div>

                <div className="desc-heading-box">
                    <div className="description">
                        BTOgether is a one stop solution to all your BTO hunting needs!
                        Looking to apply for a BTO? BTOgether helps you find the perfect upcoming project spots for you!
                    </div>
                    <Link to="/login" className="get-started-button">
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
}
 
export default EntryPage;
