import Navbar from "../components/NavBar";
import UserProfileForm from "../components/userProfileForm"

const ManageProfilePage = () => {
    return (  
        <div className="profile-page">
            <Navbar/>
            <h1> Manage Profile Page</h1>
            <UserProfileForm />
        </div>
    );
}
 
export default ManageProfilePage;