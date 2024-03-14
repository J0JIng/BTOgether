import { Link } from "react-router-dom";

const EntryPage = () => {
    return (  
        <div className="entry-page">
            <div className="navbar">
                <h1>Entry page</h1>
             </div>
             <Link to ='/login'>Get Started</Link>
        </div>
    );
}
 
export default EntryPage;