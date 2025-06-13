import { useEffect } from "react";
import { handleTokenExpiration } from "../utils/handleTokenExpiration ";
import { useNavigate, useLocation } from "react-router-dom";

const useTokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const status = localStorage.getItem("status");

    if (status !== "OK" && location.pathname !== "/login") {
      navigate("/login");
      return;
    }

    if (status === "OK") {
      handleTokenExpiration();
    }
  }, [location.pathname, navigate]);
};

export default useTokenHandler;
