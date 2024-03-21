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


// const TitleAndBox = styled.div`
//   margin-top: 60px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   gap: 60px;

//   .title-and-sign-up {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     color: rgb(55, 65, 81);

//     .title {
//         font-weight: 700;
//         font-size: 30px;
//         color: rgb(55, 65, 81);
//         min-width: 350px;
//     }

//     .register-link {
//         color: rgb(55, 65, 81);
//             &:hover {
//             color: rgb(55, 65, 81);
//             text-decoration: none;
//             transition-duration: 0.2s;
//             }

//     }
//   }
// `;