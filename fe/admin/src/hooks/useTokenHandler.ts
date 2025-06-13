import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useTokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");

    if (!expirationTime && location.pathname !== "/login") {
      navigate("/login");
      return;
    } else if (expirationTime) {
      const currentTime = new Date().getTime();
      const expirationTimeInMs = new Date(expirationTime).getTime();

      if (currentTime >= expirationTimeInMs) {
        localStorage.removeItem("expirationTime");
        navigate("/login");
        return;
      } else {
        if (location.pathname === "/login") {
          navigate("/");
          return;
        }
      }
    }
  }, [location.pathname, navigate]);
};

export default useTokenHandler;
