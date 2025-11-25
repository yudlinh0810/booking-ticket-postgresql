import { useState } from "react";
import { toast } from "react-toastify";
import { register } from "../services/auth.service";
import { useAuthModalStore } from "../store/authModalStore";
import styled from "../styles/components/registerForm.module.scss";
import { RegisterPayLoad } from "../types";
import CustomModal from "./CustomModal";
import Otp from "./Otp";
import SocialAuth from "./SocialAuth";
import InputField from "./InputFileld";

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
        <InputField
          type="text"
          id="email"
          name="email"
          label="Email"
          value={dataRegister.email}
          required
          onChange={handleChangeValue}
        />

        <InputField
          type="text"
          id="fullName"
          name="fullName"
          label="Full Name"
          value={dataRegister.fullName}
          required
          onChange={handleChangeValue}
        />

        <InputField
          type="password"
          id="password"
          name="password"
          label="Password"
          value={dataRegister.password}
          required
          onChange={handleChangeValue}
        />

        <InputField
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          value={dataRegister.confirmPassword}
          required
          onChange={handleChangeValue}
        />

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
