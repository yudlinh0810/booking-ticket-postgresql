import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useTokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = Date.now();
    const isLoginPage = location.pathname === "/login";

    if (!expirationTime) {
      if (!isLoginPage) navigate("/login");
      return;
    }

    if (currentTime >= Number(expirationTime)) {
      localStorage.removeItem("expirationTime");
      if (!isLoginPage) navigate("/login");
      return;
    }

    if (isLoginPage) {
      navigate("/");
    }
  }, [location.pathname, navigate]);
};

export default useTokenHandler;
