import { useState } from "react";
import styled from "../styles/loginForm.module.scss";
import { LoginPayLoad } from "../types";
import { loginUser } from "../services/auth.service";
import { useUserStore } from "../store/userStore";
import { useAuthModalStore } from "../store/authModalStore";
import SocialAuth from "./SocialAuth";
import { message } from "antd";

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
        fullName: result?.data?.fullName,
        dateBirth: result?.data?.dateBirth,
        phone: result?.data?.phone,
        address: result?.data?.address,
        avatar: result?.data?.urlImg,
      });
      message.success("Đăng nhập thành công");
      closeModal();
      return;
    }
  };

  return (
    <div className={styled["login-container"]}>
      <form onSubmit={handleSubmit} className={styled["login-form"]}>
        <div className={styled["login-form__input-group"]}>
          <label className={styled["login-form__label"]} htmlFor="email">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className={styled["login-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
        <div className={styled["login-form__input-group"]}>
          <label className={styled["login-form__label"]} htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={styled["login-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
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
