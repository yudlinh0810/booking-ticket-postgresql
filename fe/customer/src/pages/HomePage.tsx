import SearchTrip from "../components/SearchTrip";
import Slider from "../components/Slider";
import styles from "../styles/homePage.module.scss";
import { sliderData } from "../data/SliderData";

const HomePage = () => {
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
