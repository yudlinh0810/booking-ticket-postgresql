import SearchTrip from "../components/SearchTrip";
import Slider from "../components/Slider";
import styles from "../styles/homepage.module.scss";
import { sliderData } from "../data/SliderData";
import { message } from "antd";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { useAuthModalStore } from "../store/authModalStore";
import { useUserStore } from "../store/userStore";
import { fetchUser } from "../services/userServices.service";
const HomePage = () => {
  const [params, setParams] = useSearchParams();
  const { openModal } = useAuthModalStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    document.title = "Trang chủ";
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
        const getUser = await fetchUser();
        setUser({
          id: getUser?.id,
          email: getUser?.email,
          fullName: getUser?.fullName,
        });
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
