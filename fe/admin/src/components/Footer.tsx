import { useLocation } from "react-router";
import styled from "../styles/footer.module.scss";

const Footer = () => {
  const location = useLocation();
  return (
    <div
      className={`${styled["footer-container"]} ${
        location.pathname === "/login" ? styled.disable : ""
      }`}
    >
      <p>@ Bản quyền thuộc VEXETIENICH</p>
    </div>
  );
};

export default Footer;
