import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
import '../css/entrypage.css';
import btoLogo from '../assets/btodraftlogo.png';
import btoimage from '../assets/hdbdraftimage1.jpg';

const AboutUsPage = () => {
    return (  
        <div className="entry-page">

            <Navbar/>

            <div className="container">
                <img src={btoimage} alt="bto-image" className="image-style" />
            </div>

            <div className="heading-box">
                {/* You can add any heading box content here if needed */}
            </div>

            <div className="page-info">
                <div className="desc-heading">
                    Your Search, Your Conditions.
                </div>

                <div className="desc-heading-box">
                    <div className="description">
                        Uniting families and meeting needs, BTOgether empowers new home owners to pinpoint the best locations for their new home. 
                        With extensive search functionalities, seeking out your ideal home is easy! Whether you're looking for gyms, supermarkets, schools, clinics, malls or even hawker centres,
                        BTOgether can narrow down the best locations for you. 

                        {/* BTOgether is a one stop solution to all your BTO hunting needs!
                        Looking to apply for a BTO? BTOgether helps you find the perfect upcoming project spots for you! */}
                    </div>
                </div>
            </div>

            <div className="page-info">
                <div></div>
                <div className="desc-heading-r">
                    <div>Why BTOgether?</div>
                    
                </div>

                <div className="desc-heading-box">
                    <div></div>
                    <div className="description">
                        With BTOgether, the endless hours of scouring the web for your ideal home is a thing of the past.
                        BTOgether is a one stop solution to all your BTO hunting needs. 
                        Explore a comprehensive database of BTO projects, each curated to provide you with detailed insights and analysis. 
                        From location advantages to pricing trends, we've got you covered every step of the way!
                    </div>
                </div>
            </div>

        </div>
    );
}
 
export default AboutUsPage;
