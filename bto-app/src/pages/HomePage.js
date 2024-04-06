import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../css/homepage.css";

const HomePage = () => {
  return (
    <dev className="home-page">
      <NavBar />
      <h1>Home Page</h1>

      <div className="boxcontainer">
        <Link to="/bto-find" className="linkbox btosearch">
          BTO Finder
        </Link>
        <Link to="/dashboard" className="linkbox dashboard">
          Dashboard
        </Link>
        <Link to="/bto-planner" className="linkbox planner">
          Planner
        </Link>
      </div>
    </dev>
  );
};

export default HomePage;
