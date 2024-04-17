import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../css/aboutuspage.css";
import btoimage from "../assets/hdbdraftimage1.jpg";
import pinkwaves from "../assets/pinkwaves.svg";
import mission from "../assets/scale.png";
import unique from "../assets/diamond-anim.png";
import goal from "../assets/mission.png";
import { Box } from "@mui/material";
import handleScrollAnimation from "./script";
import React, { useState, useEffect } from "react";

const AboutUsPage = () => {
  const [boxHeight, setBoxHeight] = useState(""); // State to hold box height
  const [waveHeight, setWaveHeight] = useState(""); // State to hold box height
  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  useEffect(() => {
    handleScrollAnimation();
  }, []); // Run once after component mounts

  useEffect(() => {
    // Function to update box height based on window width
    const updateBoxHeight = () => {
      if (window.innerWidth < 1188) {
        setBoxHeight("10vh");
        setWaveHeight("20vh");
      } else {
        setBoxHeight("40vh");
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

  useEffect(() => {
    setSlideIn(true); // Trigger slide animation on component mount
  }, []);

  return (
    <div className="entry-page">
      <Navbar />
      <Box
        sx={{
          backgroundColor: "#f7776b",
          height: boxHeight, // Set height based on state
          width: "100%",
        }}
      >
        <div className={`aboutus-container ${slideIn ? "slide-in" : ""}`}>
          <div className="aboutus-title">About Us</div>
          <img src={btoimage} alt="bto-image" className="aboutus-image" />
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

      <div className=" page-info ">
        <div className="desc-heading ">
          <div>Mission and Values</div>
        </div>
        <div className="description-box">
          <div className="description">
            At BTOgether, our mission is clear: to be the premier destination
            for individuals seeking to navigate the intricate landscape of
            Build-To-Order (BTO) housing in Singapore. We understand the
            anxieties and uncertainties that often accompany the BTO application
            process, particularly for couples and young adults embarking on
            their journey towards homeownership. That's why we've made it our
            purpose to alleviate these fears and provide a seamless,
            user-friendly experience that guides users through every step of the
            application process.
          </div>

          <img
            src={mission}
            alt="mission"
            className="mission-image image-logo"
          />
        </div>
      </div>

      <div className=" page-info">
        <div className="desc-heading">
          <div>Unique Selling Proposition</div>
        </div>
        <div className="description-box">
          <div className="description">
            What sets us apart is our unwavering commitment to our users' needs.
            Our website offers innovative features that revolutionize the BTO
            application experience. Our comprehensive Planner tool guides users
            through the step-by-step process of applying for and obtaining a BTO
            property, while our intuitive DashBoard provides essential
            information about BTO properties at their fingertips. Additionally,
            our search function offers unparalleled convenience, allowing users
            to tailor their search results based on their unique preferences and
            priorities.
          </div>

          <img src={unique} alt="unique" className="unique-image image-logo" />
        </div>
      </div>

      <div className=" page-info">
        <div className="desc-heading">
          <div>Future Goals</div>
        </div>
        <div className="description-box">
          <div className="description">
            Looking ahead, our aspirations are ambitious yet attainable. We aim
            to become the mainstream and widely accepted standard method for
            Singaporeans to apply for BTOs and HDBs in general. We envision
            partnering with the government to share our website with people
            nationwide, further extending our reach and impact. As we grow, we
            anticipate expanding our team to enhance our capabilities and better
            serve our users. Additionally, we aspire to introduce innovative
            features such as virtual tours inside BTOs, enabling users to make
            even more informed choices and comparisons.
          </div>

          <img src={goal} alt="goals" className="goals-image image-logo" />
        </div>
      </div>

      <div className="spacer"></div>
    </div>
  );
};

export default AboutUsPage;
