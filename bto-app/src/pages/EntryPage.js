import React, { useEffect, useState } from "react";
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
import { Box } from "@mui/material";

const EntryPage = () => {
  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  const [boxHeight, setBoxHeight] = useState(""); // State to hold box height
  const [waveHeight, setWaveHeight] = useState(""); // State to hold box height

  useEffect(() => {
    // Function to update box height based on window width
    const updateBoxHeight = () => {
      if (window.innerWidth < 1280) {
        setBoxHeight("30vh");
        setWaveHeight("20vh");
      } else {
        setBoxHeight("50vh");
        setWaveHeight("30vh");
      }
    };

    // Call the function initially
    updateBoxHeight();

    // Add event listener for window resize
    window.addEventListener("resize", updateBoxHeight);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", updateBoxHeight);
    };
  }, []); // Run this effect only once when component mounts

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
      <Box
        sx={{
          backgroundColor: "#f7776b",
          height: boxHeight, // Set height based on state
          width: "100%",
        }}
      >
        <div className="container anim-1">
          <div className="heading-text anim-1">
            <div className="heading-text title">
              Your Search, Your Conditions
            </div>
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
      </Box>
      <Box
        sx={{
          backgroundImage: `url(${pinkwaves})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // Stretch both horizontally and vertically to cover the container
          width: "100%", // Stretch horizontally to cover entire width
          height: waveHeight, // Fixed height of 25% of viewport height
        }}
      ></Box>

      <div className="heading-box"></div>

      <div className="logos">
        <div className="key-features anim-1" style={{ marginTop: 70 }}>
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
              Find Answers to Common FAQs about BTOs and track progress with an
              organised and dynamic timeline.
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
              Access essential information information such as location, town
              council details, and estimated transport timings.
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
              Straightforward, Simple, Intuitive. Specially designed to provide
              all your needs and information a click away.
            </div>
          </div>
          <div className="search-container logo-block">
            <img
              src={Search}
              alt="Search Function"
              style={{ width: "225px", height: "225px", borderRadius: "5px" }}
            />
            <div className="header">Find your BTO</div>
            <div className="logo-description">
              Explore nearby amenities related to each BTO Location.
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
            style={{ width: "100px", height: "100px", borderRadius: "5px" }}
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
