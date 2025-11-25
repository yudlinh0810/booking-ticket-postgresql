import { message } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import SearchTrip from "../components/SearchTrip";
import Slider from "../components/Slider";
import { sliderData } from "../data/SliderData";
import { fetchUserDetail } from "../services/userServices.service";
import { useAuthModalStore } from "../store/authModalStore";
import { useUserStore } from "../store/userStore";
import styles from "../styles/pages/homePage.module.scss";

const HomePage = () => {
  const [params, setParams] = useSearchParams();
  const { openModal } = useAuthModalStore();
  const { setUser, logout } = useUserStore();

  useEffect(() => {
    document.title = "Trang chủ";
    console.log(1);
  }, []);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const status = params.get("login");
      if (status === "failed") {
        openModal("login");
        message.error("Đăng nhập thất bại, vui lòng thử lại");
        params.delete("login");
        params.delete("reason");
        setParams(params, { replace: true });
      } else if (status === "success") {
        message.success("Đăng nhập thành công");
        params.delete("login");

        try {
          console.log("Attempting fetchUserDetail after successful login...");
          const getUser = await fetchUserDetail();

          setUser({
            id: getUser.id,
            email: getUser.email,
            first_name: getUser.first_name,
            last_name: getUser.last_name,
          });
        } catch (error) {
          console.error("fetchUser failed immediately after OAuth:", error);
          message.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
          logout();
        }
        setParams(params, { replace: true });
      } else {
        return;
      }
    };
    fetchAndSetUser();
  }, []);

  return (
    <div className={styles["homepage-container"]}>
      <div className={styles["banner-wrapper"]}>
        <img
          className={styles["img-banner"]}
          src="https://static.vexere.com/production/banners/1209/leaderboard_1440x480.jpg"
          alt="banner-wrapper"
        />
        <div className={styles["search-trip-wrapper"]}>
          <SearchTrip />
        </div>
      </div>
      <Slider sliderArray={sliderData} delay={4000} />
      <Slider sliderArray={sliderData} delay={3000} swiperWidth={20} />
      <Slider sliderArray={sliderData} delay={1000} />
    </div>
  );
};

export default HomePage;
