import { Link } from "react-router-dom";

const LoginPage = () => {
    return (  
        <div className="navbar">
            <h1>Hello Login page</h1>
            <Link to ='/home'>Authenticate</Link>
        </div>
    );
}
 
export default LoginPage;