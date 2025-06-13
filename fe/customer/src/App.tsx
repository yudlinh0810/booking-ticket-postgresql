import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.scss";
import "./styles/root.scss";
import "./styles/reset.scss";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import useClientWidth from "./utils/useClientWidth";
import { ToastContainer } from "react-toastify";
import SearchTripPage from "./pages/SearchTripPage";
import { useEffect } from "react";
import BookedPage from "./pages/BookedPage";
import { handleTokenExpiration } from "./utils/handleTokenExpiration ";
import useOffline from "./hooks/useOfflie";
import Profile from "./pages/Profile";

function App() {
  useOffline();

  useEffect(() => {
    const interval = setInterval(() => {
      const status = localStorage.getItem("status");
      if (status === "OK") {
        handleTokenExpiration();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useClientWidth();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route
          path="/tim-kiem"
          element={
            <Layout>
              <SearchTripPage />
            </Layout>
          }
        />
        <Route
          path="/dat-ve"
          element={
            <Layout>
              <BookedPage />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer
        className="custom-toast"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
