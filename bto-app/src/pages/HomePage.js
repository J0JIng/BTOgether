import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../css/homepage.css";
import dashboard from "../assets/dashboard-actual.png";
import btofind from "../assets/bto-find-actual.png";
import Planner from "../assets/bto-planner-actual.png";
import { auth } from "../utils/firebase"; // Import Firebase auth

const HomePage = () => {
  const [showGridsAnimation, setShowGridsAnimation] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Clean-up function
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page">
      <NavBar />

      <div className="mx-auto max-w-7xl py-10">
        <h1>Welcome!</h1>
        {currentUser ? (
          <p>Hello, {currentUser.displayName || currentUser.email}!</p>
        ) : (
          <p>Please sign in.</p>
        )}
        <div className="mt-10">
          <div
            className={`grid grid-cols-3 gap-6 ${
              showGridsAnimation ? "animate-fadeIn" : ""
            }`}
          >
            <Link to="/bto-find" className="linkbox btosearch">
              <div className="relative h-90">
                <img
                  src={btofind}
                  alt="btofind"
                  className="ring-4 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 w-full h-full object-cover"
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white opacity-0 transition-opacity duration-300 pointer-events-none">
                  BTO Finder
                </p>
              </div>
            </Link>

            <div className="linkbox dashboard">
              <Link to="/dashboard">
                <div className="relative h-90">
                  <img
                    src={dashboard}
                    alt="Dashboard"
                    className="ring-4 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 w-full h-full object-cover"
                  />
                  <p className="absolute bottom-2 left-0 right-0 text-center text-white opacity-0 transition-opacity duration-300 pointer-events-none">
                    Dashboard
                  </p>
                </div>
              </Link>
            </div>

            <Link to="/bto-planner" className="linkbox planner">
              <div className="relative h-100">
                <img
                  src={Planner}
                  alt="Dashboard"
                  className="ring-4 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 w-full h-full object-cover"
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white opacity-0 transition-opacity duration-300 pointer-events-none">
                  Planner
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
