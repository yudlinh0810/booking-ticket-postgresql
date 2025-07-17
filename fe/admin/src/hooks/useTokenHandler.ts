import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useTokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    const isLoginPage = location.pathname === "/login";

    if (!expirationTime && !isLoginPage) {
      navigate("/login");
    } else if (expirationTime && isLoginPage) {
      navigate("/");
    }
  }, [location.pathname, navigate]);
};

export default useTokenHandler;
