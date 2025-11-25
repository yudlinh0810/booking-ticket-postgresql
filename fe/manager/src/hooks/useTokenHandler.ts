import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { eventEmitter } from "../utils/eventEmitter";

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

  useEffect(() => {
    const handleForceLogout = () => {
      navigate("/login");
    };

    eventEmitter.on("force-logout", handleForceLogout);

    return () => {
      eventEmitter.off("force-logout", handleForceLogout);
    };
  }, [navigate]);
};

export default useTokenHandler;
