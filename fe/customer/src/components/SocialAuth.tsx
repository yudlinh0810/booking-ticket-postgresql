// import { useEffect, useState } from "react";
import { loginWithGoogle } from "@/services/auth.service";
import { useAuthModalStore } from "@/store/authModalStore";
import { useUserStore } from "@/store/userStore";
import styled from "../styles/components/socialAuth.module.scss";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { message } from "antd";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const SocialAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { closeModal } = useAuthModalStore();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    try {
      if (!credential) return;
      const res = await loginWithGoogle(credential);

      console.log("Login success:", res);
      if (res?.status !== "OK") {
        message.error("Đăng nhập thất bại");
        return;
      } else {
        setUser({
          id: res.user.id || 0,
          email: res.user.email,
          first_name: res.user.first_name || "",
          last_name: res.user.last_name || "",
        });
        closeModal();
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed backend:", error);
    }
  };

  return (
    <div className={styled["btn-group"]}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
          // Tắt useOneTap tạm thời để test
          useOneTap
          context="signin"
          theme="filled_blue" // hoặc filled_blue, filled_black
          size="large"
          shape="pill"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default SocialAuth;
