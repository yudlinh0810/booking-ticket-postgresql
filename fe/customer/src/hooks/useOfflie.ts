import { useEffect } from "react";
import { logoutCustomer } from "../services/auth.service";
import { toast } from "react-toastify";
import { useUserStore } from "../store/userStore";
import { useAuthModalStore } from "../store/authModalStore";

const useOffline = () => {
  const { logout } = useUserStore();
  const { openModal } = useAuthModalStore();
  useEffect(() => {
    window.addEventListener("offline", handleOffline);

    return () => window.removeEventListener("offline", handleOffline);
  });

  const handleOffline = async () => {
    const response = await logoutCustomer();
    if (response.status === "OK") {
      toast.success("Đăng xuất thành công");
      logout();
      openModal("login");
    } else {
      toast.error("Đăng xuất thất bại");
    }
  };
};

export default useOffline;
