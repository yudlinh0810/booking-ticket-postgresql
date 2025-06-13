import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { login } from "../services/auth.service";
import styled from "../styles/login.module.scss";
import testEmail from "../utils/testEmail";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!form.email || !form.password) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      } else {
        if (testEmail(form.email) === false) {
          toast.error("Email không hợp lệ");
          return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        const response = await login(form);
        localStorage.setItem("expirationTime", response.expirationTime);
        toast.success("Đăng nhập thành công");
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styled["login-container"]}>
      <form onSubmit={handleLogin} className={styled.form}>
        <h2 className={styled.title}>Đăng nhập</h2>
        <div className={styled.inputGroup}>
          <div className={styled.email}>
            <input
              type="text"
              className={styled.input}
              placeholder="Nhập email"
              name="email"
              value={form.email}
              onChange={(e) => handleChangeValue(e)}
            />
          </div>
          <div className={styled.password}>
            <input
              placeholder="Nhập mật khẩu"
              className={styled.input}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(e) => handleChangeValue(e)}
            />
            {showPassword ? (
              <FontAwesomeIcon
                className={styled.iconShowPassword}
                icon={faEyeSlash}
                onClick={handleClickShowPassword}
              />
            ) : (
              <FontAwesomeIcon
                className={styled.iconShowPassword}
                icon={faEye}
                onClick={handleClickShowPassword}
              />
            )}
          </div>
        </div>
        <div className="action">
          <button type="submit" className={styled.buttonSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
