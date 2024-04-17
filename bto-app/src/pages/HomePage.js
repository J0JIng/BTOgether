import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../css/global.css";

import btofind from "../assets/yellowhdb.jpeg";
import dashboard from "../assets/redhdb.jpg";
import Planner from "../assets/greenhdb.jpg";
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
        <div className="mt-10 flex justify-center">
          <div
            className={`grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-40 ${
              showGridsAnimation ? "animate-fadeIn" : ""
            }`}
          >
            <Link
              to="/bto-find"
              className="linkbox btosearch relative  transition duration-300  hover:scale-105"
            >
              <div className="relative">
                <img
                  src={btofind}
                  alt="btofind"
                  className="ring-4 ring-rose-400 w-[350px] h-[500px] rounded-lg shadow-xl transition duration-300 "
                />
                <div
                  className="ring-4 rounded-lg ring-transparent w-[350px] h-[500px] object-cover absolute inset-0 flex items-center justify-center
                 bg-red-200 bg-opacity-70 transition-opacity duration-300 hover:opacity-0"
                >
                  <p className="text-3xl text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    BTO Finder
                  </p>
                </div>
              </div>
            </Link>

            <div className="linkbox dashboard  transition duration-300  hover:scale-105">
              <Link to="/dashboard">
                <div className="relative">
                  <img
                    src={dashboard}
                    alt="Dashboard"
                    className="ring-4 ring-rose-400 w-[350px] h-[500px] rounded-lg shadow-xl transition duration-300"
                  />
                  <div
                    className="ring-4 rounded-lg ring-transparent w-[350px] h-[500px] object-cover absolute inset-0 flex items-center justify-center
                 bg-red-200 bg-opacity-70 transition-opacity duration-300 hover:opacity-0"
                  >
                    <p className="text-3xl text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                      BTO Dashboard
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <Link
              to="/bto-planner"
              className="linkbox planner  transition duration-300  hover:scale-105"
            >
              <div className="relative">
                <img
                  src={Planner}
                  alt="Dashboard"
                  className="ring-4 ring-rose-400 w-[350px] h-[500px] rounded-lg shadow-xl transition duration-300 "
                />
                <div
                  className="ring-4 rounded-lg ring-transparent w-[350px] h-[500px] object-cover absolute inset-0 flex items-center justify-center
                 bg-red-200 bg-opacity-70 transition-opacity duration-300 hover:opacity-0"
                >
                  <p className="text-3xl text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    BTO Planner
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
