import { useEffect } from "react";
import { useUserStore } from "../store/userStore";

const useOffline = () => {
  const { logout } = useUserStore();
  useEffect(() => {
    window.addEventListener("offline", handleOffline);

    return () => window.removeEventListener("offline", handleOffline);
  });

  const handleOffline = async () => {
    logout();
    localStorage.removeItem("accept");
    localStorage.removeItem("expirationTime");
    window.location.href = "/login";
  };
};

export default useOffline;
