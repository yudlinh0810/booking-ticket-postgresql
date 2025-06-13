import { useState } from "react";
import styled from "../styles/registerForm.module.scss";
import { RegisterPayLoad } from "../types";
import { register } from "../services/auth.service";
import CustomModal from "./CustomModal";
import { toast } from "react-toastify";
import Otp from "./Otp";
import { useAuthModalStore } from "../store/authModalStore";
import SocialAuth from "./SocialAuth";

const RegisterForm = () => {
  const { closeModal, setType } = useAuthModalStore();
  const [dataRegister, setDataRegister] = useState<RegisterPayLoad>({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [openModalOtp, setOpenModalOtp] = useState(false);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await register(dataRegister);
    if (result.status === "OK") {
      setOpenModalOtp(true);
    } else {
      return toast.error(result.message);
    }
  };

  const handleCloseModal = () => {
    setOpenModalOtp(false);
    closeModal();
  };

  return (
    <div className={styled["register-container"]}>
      <form onSubmit={handleSubmit} className={styled["register-form"]}>
        <div className={styled["register-form__input-group"]}>
          <label className={styled["register-form__label"]} htmlFor="email">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className={styled["register-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
        <div className={styled["register-form__input-group"]}>
          <label className={styled["register-form__label"]} htmlFor="fullName">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={styled["register-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
        <div className={styled["register-form__input-group"]}>
          <label className={styled["register-form__label"]} htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={styled["register-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
        <div className={styled["register-form__input-group"]}>
          <label className={styled["register-form__label"]} htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={styled["register-form__input"]}
            required
            onChange={handleChangeValue}
          />
        </div>
        <button type="submit" className={styled["register-form__submit"]}>
          Register
        </button>
      </form>
      <div className={styled.separation}>
        {" "}
        <span>hoặc</span>{" "}
      </div>
      <div className={styled["another-actions"]}>
        <SocialAuth />
        <div className={styled["action-login"]}>
          <p>Bạn đã có tài khoản?</p>
          <button type="button" className={styled.btn} onClick={() => setType("login")}>
            Đăng nhập
          </button>
        </div>
      </div>
      <CustomModal title="Xác thực OTP" open={openModalOtp} onCancel={() => setOpenModalOtp(false)}>
        <Otp email={dataRegister.email} onCloseModal={handleCloseModal} />
      </CustomModal>
    </div>
  );
};

export default RegisterForm;
