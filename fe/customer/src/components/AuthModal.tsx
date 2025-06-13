import { useAuthModalStore } from "../store/authModalStore";
import { Modal, Tabs } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = () => {
  const { isOpen, closeModal, type, setType } = useAuthModalStore();
  return (
    <Modal open={isOpen} onCancel={closeModal} footer={null} centered getContainer={false}>
      <Tabs
        activeKey={type}
        onChange={(key) => setType(key as "login" | "register" | "OTP" | "forgotPassword")}
        items={[
          {
            label: "Đăng nhập",
            key: "login",
            children: <LoginForm />,
          },
          {
            label: "Đăng ký",
            key: "register",
            children: <RegisterForm />,
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;
