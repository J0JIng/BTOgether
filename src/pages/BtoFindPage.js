import Navbar from "../components/NavBar";
import GeojsonMapComponent from "../components/GeojsonMapComponent"

const BtoFindPage = () => {
    return (  
        <div className="bto-find-page">
            <Navbar/>
            <h1> Manage Bto Find Page</h1>
            {/* Map Div */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <GeojsonMapComponent />
            </div>
        </div>
    );
}
 
export default BtoFindPage;