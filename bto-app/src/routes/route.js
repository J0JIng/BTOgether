import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from '../components/NavBar';

import {
    entryPage,
    login,
    aboutUs,
    faqsTabName,
    home,
    spinalCase,
} from "../utils/pageConstants";

import EntryPage from "../pages/EntryPage";
import LoginPage from "../pages/LoginPage";
import FAQsPage from "../pages/FAQsPage";
import AboutUsPage from "../pages/AboutUsPage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

const AppRouter = () => (
    <Router>
        <Routes>
        <Route path='/' element={<EntryPage/>}/>
        <Route path={spinalCase(login)} element={<LoginPage/>}/>
        <Route path={spinalCase(aboutUs)} element={<AboutUsPage/>}/>
        <Route path={spinalCase(faqsTabName)} element={<FAQsPage/>}/>
        <Route path={spinalCase(home)} element={<HomePage/>}/>
        <Route path= '*' element={<NotFound/>}/>
        </Routes>
  </Router>
);

export default AppRouter;