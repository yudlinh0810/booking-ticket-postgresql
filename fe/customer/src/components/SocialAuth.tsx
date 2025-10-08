import { useEffect, useState } from "react";
import styled from "../styles/socialAuth.module.scss";

const SocialAuth = () => {
  const [backendUrl, setBackendUrl] = useState<string>("");

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL?.trim();
    if (url) {
      setBackendUrl(url);
    } else {
      console.error("VITE_API_URL is not defined in .env");
    }
  }, []);

  const googleLink = backendUrl ? `https://${backendUrl}.ngrok-free.app/auth/google` : "#";

  return (
    <div className={styled["btn-group"]}>
      <a className={styled["btn-item"]} href={googleLink}>
        Tiếp tục với Google
      </a>
      <a type="button" className={styled["btn-item"]}>
        Tiếp tục với Facebook
      </a>
    </div>
  );
};

export default SocialAuth;
