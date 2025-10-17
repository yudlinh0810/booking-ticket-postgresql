import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.scss";
import "./styles/root.scss";
import "./styles/reset.scss";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import useClientWidth from "./utils/useClientWidth";
import { ToastContainer } from "react-toastify";
import SearchTripPage from "./pages/SearchTripPage";
import BookedPage from "./pages/BookedPage";
import useOffline from "./hooks/useOfflie";
import Profile from "./pages/Profile";

function App() {
  useOffline();
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
