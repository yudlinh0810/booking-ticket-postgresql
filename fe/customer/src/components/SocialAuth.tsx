import styled from "../styles/socialAuth.module.scss";

const SocialAuth = () => {
  const handleGoogleAuth = async () => {
    window.location.href = `https://${
      import.meta.env.VITE_API_URL
    }.ngrok-free.app/api/social-auth/google`;
  };
  return (
    <div className={styled["btn-group"]}>
      <button type="button" className={styled["btn-item"]} onClick={handleGoogleAuth}>
        Tiếp tục với Google
      </button>
      <button type="button" className={styled["btn-item"]}>
        Tiếp tục với Facebook
      </button>
    </div>
  );
};

export default SocialAuth;
