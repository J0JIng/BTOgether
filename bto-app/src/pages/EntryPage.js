import { Link } from "react-router-dom";
import styles from '../css/loginpage.css'

const EntryPage = () => {
    return (  
        <div className="navbar">
            <h1>hELLO Entry page</h1>
            <Link to ='/login'>login</Link>
        </div>
    );
}
 
export default EntryPage;   

