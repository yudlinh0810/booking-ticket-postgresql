import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventEmitter } from "../utils/eventEmitter";

const useForceLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => navigate("/login");
    eventEmitter.on("force-logout", handleLogout);
    return () => eventEmitter.off("force-logout", handleLogout);
  }, [navigate]);
};

export default useForceLogout;
