import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/entrypage.css";
import btoLogo from "../assets/btodraftlogo.png";
import btoimage from "../assets/hdbdraftimage1.jpg";
import btoimage2 from "../assets/hdb_aesthetic.jpg";
import Planner from "../assets/Planner.png";
import Dashboard from "../assets/Dashboard.png";
import Search from "../assets/Search.png";
import Easy from "../assets/Easy.png";
import apostrophe from "../assets/apostrophe2.png";
import savetime from "../assets/save-time.png";
import streetmap from "../assets/street-map.png";
import pinkwaves from "../assets/pinkwaves.svg";
import handleScrollAnimation from "./script";

const EntryPage = () => {
  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  return (
    <div className="entry-page">
      <div className="top-box-entry-page">
        <div className="logo-and-title">
          <div className="logo-image ">
            <img
              src={btoLogo}
              alt="bto-logo"
              style={{ width: "60px", height: "60px", borderRadius: "5px" }}
            />
          </div>

          <div className="title-heading anim-1">BTOgether</div>
        </div>
        <Link to="/login" className="get-started-button">
          Get Started
        </Link>
      </div>

      <div className="container anim-1">
        <div className="heading-text anim-1">
          <div className="heading-text title">Your Search, Your Conditions</div>
          <div className="heading-text description">
            Streamline your BTO journey. Explore, plan, and secure your dream
            home effortlessly with personalized recommendations and intuitive
            tools. Your path, your terms.
          </div>
        </div>

        <img
          src={btoimage}
          alt="bto-image"
          className="first-hdb-image image-style"
        />
      </div>

      <div className="heading-box"></div>

      <div className="heading-box-waves">
        <img src={pinkwaves} alt="pinkwaves" className="waves-image" />
      </div>

      {/* <div className="heading-text anim-1">
                <div className="heading-text title">Your Search, Your Conditions</div>
                <div className="heading-text description">
                Streamline your BTO journey. Explore, plan, and secure your dream home 
                effortlessly with personalized recommendations and intuitive tools. 
                Your path, your terms.
                </div>
            </div> */}

      <div className="logos">
        <div className="key-features anim-1">
          <div className="title ">Key Features</div>
        </div>

        <div className="top">
          <div className="planner-container logo-block">
            <img
              src={Planner}
              alt="Planner"
              style={{ width: "225px", height: "225px", borderRadius: "5px" }}
            />
            <div className="header">Planner</div>
            <div className="logo-description">
              Some words that will become the description of the image and show
              of the features of out website
            </div>
          </div>
          <div className="dashboard-container logo-block">
            <img
              src={Dashboard}
              alt="Dashboard"
              style={{ width: "225px", height: "225px", borderRadius: "5px" }}
            />
            <div className="header">Dashboard</div>
            <div className="logo-description">
              Some words that will become the description of the image and show
              of the features of out website
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="easy-container logo-block">
            <img
              src={Easy}
              alt="Easy To Search"
              style={{ width: "225px", height: "225px", borderRadius: "5px" }}
            />
            <div className="header">Easy to Use</div>
            <div className="logo-description">
              Some words that will become the description of the image and show
              of the features of out website
            </div>
          </div>
          <div className="search-container logo-block">
            <img
              src={Search}
              alt="Search Function"
              style={{ width: "225px", height: "225px", borderRadius: "5px" }}
            />
            <div className="header">Search Function</div>
            <div className="logo-description">
              Some words that will become the description of the image and show
              of the features of out website
            </div>
          </div>
        </div>
      </div>

      <div className="anim-2 page-info">
        <div className="desc-heading">
          <div>Why use BTOgether?</div>
        </div>
        <div className="description-box">
          <img src={apostrophe} className="apostrophe-image" />
          <div className="description">
            With BTOgether, the endless hours of scouring the web for your ideal
            home is a thing of the past. BTOgether is a one stop solution to all
            your BTO hunting needs. Explore a comprehensive database of BTO
            projects, each curated to provide you with detailed insights and
            analysis. From location advantages to pricing trends, we've got you
            covered every step of the way!
          </div>

          <img src={savetime} className="save-time-image" />
        </div>
      </div>

      <div className="anim-3 page-info">
        <div className="desc-heading-second">Your Search, Your Conditions</div>
        <div className="description-box-second">
          <img src={streetmap} className="streetmap-image" />
          <div className="description-second">
            Uniting families and meeting needs, BTOgether empowers new home
            owners to pinpoint the best locations for their new home. With
            extensive search functionalities, seeking out your ideal home is
            easy! Whether you're looking for gyms, supermarkets, schools,
            clinics, malls or even hawker centres, BTOgether can narrow down the
            best locations for you.
          </div>
          <img src={apostrophe} className="apostrophe-image-second" />
        </div>
      </div>

      <footer>
        <div className="image-title">
          <img
            src={btoLogo}
            className="bto-logo-bottom"
            alt="bto-logo"
            style={{ width: "200px", height: "200px", borderRadius: "5px" }}
          />
          <div className="title-and-tagline">
            <div className="footer-title">BTOgether</div>
            <div className="footer-title-tagline">
              Your Search, Your Conditions
            </div>
            <Link to="/login" className="get-started-button-footer">
              Get Started
            </Link>
          </div>
        </div>

        <img src={btoimage2} className="bto-image-footer" />
      </footer>
    </div>
  );
};

export default EntryPage;
