import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { PrivateRoute } from "../components/PrivateRoute";
import "../css/global.css";

import {
  entryPage,
  login,
  aboutUs,
  faqsTabName,
  home,
  spinalCase,
  profile,
  dashboard,
  btofind,
  btoplanner,
} from "../utils/pageConstants";

import EntryPage from "../pages/EntryPage";
import LoginPage from "../pages/LoginPage";
import FAQsPage from "../pages/FAQsPage";
import AboutUsPage from "../pages/AboutUsPage";
import HomePage from "../pages/HomePage";
import ManageProfilePage from "../pages/ManageProfilePage";
import BtoFindPage from "../pages/BtoFindPage";
import BtoPlannerPage from "../pages/BtoPlannerPage";
import DashboardPage from "../pages/DashboardPage";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });

    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage user={user} />} />
        <Route path={spinalCase(login)} element={<LoginPage user={user} />} />

        <Route
          path={spinalCase(home)}
          element={
            <PrivateRoute user={user}>
              <HomePage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(faqsTabName)}
          element={
            <PrivateRoute user={user}>
              <FAQsPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(aboutUs)}
          element={
            <PrivateRoute user={user}>
              <AboutUsPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(profile)}
          element={
            <PrivateRoute user={user}>
              <ManageProfilePage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(btofind)}
          element={
            <PrivateRoute user={user}>
              <BtoFindPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(btoplanner)}
          element={
            <PrivateRoute user={user}>
              <BtoPlannerPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path={spinalCase(dashboard)}
          element={
            <PrivateRoute user={user}>
              <DashboardPage />
            </PrivateRoute>
          }
        ></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
