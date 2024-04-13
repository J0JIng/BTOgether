import Navbar from "../components/NavBar";
import GeojsonMapComponent from "../components/GeojsonMapComponent";
import "../css/BTOfindpage.css";

const BtoFindPage = () => {
  return (
    <div className="bto-find-page">
      <Navbar />
      <div className="mx-auto py-2 px-10">
        <h1 className="text-black-800 text-3xl font-bold mr-2">
          Manage BTO Find
        </h1>
        {/* Map Div */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <GeojsonMapComponent />
        </div>
      </div>
    </div>
  );
};

export default BtoFindPage;
