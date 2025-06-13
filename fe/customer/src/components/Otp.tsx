import { useEffect, useState } from "react";
import { veriFyEmail } from "../services/auth.service";
import { toast } from "react-toastify";
import { useUserStore } from "../store/userStore";
import styled from "../styles/otp.module.scss";

const Otp = ({ email, onCloseModal }: { email: string; onCloseModal: () => void }) => {
  const [otpValue, setOtpValue] = useState({});
  const { setUser, user } = useUserStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await veriFyEmail(otpValue);
    if ((response.status === "OK", onCloseModal)) {
      const data = response.data;
      setUser({ email: data.email, fullName: data.fullName });
      setOtpValue({});
      onCloseModal();
      toast.success("Đăng ký thành công");
      return;
    } else {
      return toast.error(response.message);
    }
  };

  useEffect(() => {
    setOtpValue({ ...otpValue, email: email });
  }, [email]);

  console.log("user", user);

  return (
    <div className={styled["otp-container"]}>
      <form onSubmit={handleSubmit} className={styled["otp-form"]}>
        <div className={styled["otp-form__input-group"]}>
          <label htmlFor="otp" className={styled["otp-form__label"]}>
            Email:
          </label>
          <input
            className={styled["otp-form__input"]}
            type="text"
            id="otp"
            name="otp"
            value={email}
            required
            readOnly
          />
        </div>
        <div className={styled["otp-form__input-group"]}>
          <label htmlFor="otp" className={styled["otp-form__label"]}>
            OTP:
          </label>
          <input
            className={styled["otp-form__input"]}
            type="text"
            id="otp"
            name="otp"
            required
            onChange={(e) => setOtpValue({ ...otpValue, otp: e.target.value })}
          />
        </div>
        <button type="submit" className={styled["otp-form__submit"]}>
          Submit
        </button>
      </form>
      <div className={styled["action-resend"]}>
        <p>Gửi lại mã OTP?</p>
        <button className={styled.btn} type="button">
          Resend
        </button>
      </div>
    </div>
  );
};

export default Otp;
