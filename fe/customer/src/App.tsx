import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useOffline from "./hooks/useOfflie";
import Layout from "./layouts/Layout";
import BookedPage from "./pages/BookedPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SearchTripPage from "./pages/SearchTripPage";
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";
import useClientWidth from "./utils/useClientWidth";

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
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            // <Layout>
            <NotFoundPage />
            // </Layout>
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
