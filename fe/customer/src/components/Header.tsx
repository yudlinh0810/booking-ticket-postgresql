import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-booking-bus.png";
import { logoutCustomer } from "../services/auth.service";
import { useAuthModalStore } from "../store/authModalStore";
import { useUserStore } from "../store/userStore";
import styled from "../styles/header.module.scss";
import { clearAccessToken } from "../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [labguageIcon, setLanguageIcon] = useState<boolean>(true);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const { openModal } = useAuthModalStore();
  const { user, logout } = useUserStore();
  const sideBarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggleSideBar = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleLanguage = () => {
    setLanguageIcon(!labguageIcon);
  };

  const handleLogout = async () => {
    const response = await logoutCustomer();
    if (response && response.status === "OK") {
      logout();
      clearAccessToken();
      setCollapsed(true);
      message.success("Đăng xuất thành công");
      navigate("/");
    } else {
      message.error("Đăng xuất thất bại");
      return;
    }
  };

  const handleClickOutSide = (e: MouseEvent) => {
    e.stopPropagation();
    if (!collapsed && sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
      setCollapsed(true);
    }
  };

  const handleClickOutSideDropList = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutSideDropList);
      return () => document.removeEventListener("mousedown", handleClickOutSideDropList);
    }
  }, [showDropDown]);

  useEffect(() => {
    if (!collapsed) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [collapsed]);

  return (
    <div className={styled["container-header"]}>
      <div className={styled["top-header"]}>
        <div className={styled.actions}>
          <div className={styled["action__show-side-bar"]}>
            <FaBars
              onMouseDown={(e) => {
                e.stopPropagation();
                handleToggleSideBar();
              }}
              className={styled["action__show-side-bar__icon"]}
            />
          </div>
          <div className={styled.languages}>
            <img
              src={
                labguageIcon === true
                  ? "https://futabus.vn/images/icons/vietnam.svg"
                  : "https://futabus.vn/images/icons/eng.svg"
              }
              alt={"language-icon"}
              onClick={handleToggleLanguage}
            />
          </div>
        </div>

        <Link to={"/"} className={styled["logo-banner"]}>
          <img src={logo} alt="logo" className={styled["logo-banner__img"]} />
        </Link>

        {!user ? (
          <div className={styled["login-register"]}>
            <button
              type="button"
              className={styled["login-register__button"]}
              onClick={() => openModal("login")}
            >
              <FontAwesomeIcon icon={faUser} className={styled["login-register__link-ic"]} />
              <p className={styled["login-register__link-text"]}>Đăng nhập/Đăng ký</p>
            </button>
          </div>
        ) : (
          <div className={styled["user-actions"]}>
            <div
              className={styled["user-actions__button"]}
              // onMouseEnter={() => setShowDropDown(true)}
              onClick={() => setShowDropDown((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faUser} className={`${styled["user-ic"]}`} />
              <p className={styled["user-actions__link-text"]}>
                {user.fullName === "" ? user.email : user.fullName}
              </p>
            </div>
            {showDropDown ? (
              <div ref={wrapperRef} className={styled["wrapper-drop-down-list"]}>
                <ul className={styled["user-actions__list"]}>
                  <li className={styled["item"]}>
                    <NavLink className={styled.text} to={`/profile`}>
                      Cập nhật thông tin
                    </NavLink>
                  </li>
                  <li className={styled["item"]}>
                    <NavLink className={styled.text} to={`/settings`}>
                      Cài đặt
                    </NavLink>
                  </li>
                  <li className={styled["item"]} onClick={handleLogout}>
                    <span className={styled.text}>Đăng xuất</span>
                  </li>
                </ul>
                <span className={styled.triangle}></span>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className={styled["bottom-header"]}>
        <div className={styled["bottom-header__menu"]}>
          <ul className={styled.list}>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Trang chủ</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Lịch trình</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Tra cứu vé</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Tin tức</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Hóa đơn</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/*  */}
      {!collapsed && <div className={styled["overlay"]} />}
      {/*  */}
      <div
        ref={sideBarRef}
        className={`${collapsed ? styled["collapsed"] : styled["side-bar-mobile"]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styled["side-bar-mobile__top-section"]}>
          <button className={styled["side-bar-mobile__closed-btn"]} onClick={handleToggleSideBar}>
            X
          </button>
          <span className={styled["side-bar-mobile__logo"]}>YudLinhBus</span>
        </div>
        <nav className={styled["side-bar-mobile__menu"]}>
          <ul className={styled.list}>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Trang chủ</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Lịch trình</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tra cứu vé</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tin tức</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Hóa đơn</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Liên hệ</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Về chúng tôi</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tuyển dụng</span>
              </NavLink>
            </li>
            {user ? (
              <li className={`${styled["side-bar-mobile__menu-item"]} ${styled["action-logout"]}`}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className={styled["ic-default"]}
                  onClick={handleLogout}
                />
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
