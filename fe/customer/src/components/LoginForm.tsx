import { message } from "antd";
import { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useAuthModalStore } from "../store/authModalStore";
import { useUserStore } from "../store/userStore";
import styled from "../styles/components/loginForm.module.scss";
import { LoginPayLoad } from "../types";
import InputField from "./InputFileld";
import SocialAuth from "./SocialAuth";

const LoginForm = () => {
  const [dataLogin, setDataLogin] = useState<LoginPayLoad>({
    email: "",
    password: "",
  });
  const { setUser } = useUserStore();
  const { closeModal, setType } = useAuthModalStore();

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await loginUser(dataLogin);
    if (result.status === "OK" && result.data) {
      setUser({
        id: result?.data?.id,
        email: result?.data?.email,
        first_name: result?.data?.first_name,
        last_name: result?.data?.last_name,
        date_birth: result?.data?.date_birth,
        phone: result?.data?.phone,
        address: result?.data?.address,
        avatar: result?.data?.url_img,
      });
      message.success("Đăng nhập thành công");
      closeModal();
      return;
    } else {
      return message.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div className={styled["login-container"]}>
      <form onSubmit={handleSubmit} className={styled["login-form"]}>
        <InputField
          type="text"
          id="email"
          name="email"
          label="Email"
          required
          value={dataLogin.email}
          onChange={handleChangeValue}
        />
        <InputField
          type="password"
          id="password"
          name="password"
          label="Password"
          value={dataLogin.password}
          required
          onChange={handleChangeValue}
        />
        <button type="submit" className={styled["login-form__submit"]}>
          Đăng nhập
        </button>
      </form>
      <div className={styled.separation}>
        {" "}
        <span>hoặc</span>{" "}
      </div>
      <div className={styled["another-actions"]}>
        <SocialAuth />
        <div className={styled["action-register"]}>
          <p> Bạn chưa có tài khoản?</p>
          <button type="button" className={styled.btn} onClick={() => setType("register")}>
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
