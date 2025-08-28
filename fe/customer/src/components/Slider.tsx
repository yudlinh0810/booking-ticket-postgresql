import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { useEqualHeightWithCSSModules } from "../hooks/useEqualHeight";
import styled from "../styles/sliders.module.scss";
import { SliderObj } from "../data/SliderData";
import { useEffect, useRef, useState } from "react";
import { NavigationOptions, PaginationOptions } from "swiper/types";

interface SliderProps {
  sliderArray: SliderObj[];
  delay?: number;
  swiperWidth?: number;
}

const Slider: React.FC<SliderProps> = ({ sliderArray, delay = 3000, swiperWidth = 15 }) => {
  const [swiperEl, setSwiperEl] = useState<HTMLElement | null>(null);
  const [showNavPagination, setShowNavPagination] = useState(false);

  const paginationRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!swiperEl) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => calculatorShowNavPagination());
    });

    observer.observe(swiperEl);

    calculatorShowNavPagination();

    return () => observer.disconnect();
  }, [swiperEl, sliderArray.length, swiperWidth]);

  useEqualHeightWithCSSModules(styled["card-link"], swiperEl);
  useEqualHeightWithCSSModules(styled["card-title"], swiperEl);

  const calculatorShowNavPagination = () => {
    if (swiperEl) {
      const spaceBetween = 10;
      const totalSlidesWidth =
        sliderArray.length * (swiperWidth * 16) + (sliderArray.length - 1) * spaceBetween;
      if (totalSlidesWidth > swiperEl.offsetWidth) {
        setShowNavPagination(true);
      } else {
        setShowNavPagination(false);
      }
    }
  };

  return (
    <div className={styled["swiper-container"]}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{
          clickable: true,
          el: paginationRef.current,
        }}
        navigation={{
          nextEl: nextRef.current,
          prevEl: prevRef.current,
        }}
        autoplay={{
          delay: delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={10}
        slidesPerView={"auto"}
        loop={true}
        className={styled["custom-swiper"]}
        onBeforeInit={(swiper: SwiperClass) => {
          setSwiperEl(swiper.el);
        }}
        onInit={(swiper: SwiperClass) => {
          // Set pagination
          if (paginationRef.current) {
            (swiper.params.pagination as PaginationOptions).el = paginationRef.current;
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();
          }

          // Set navigation
          if (nextRef.current && prevRef.current) {
            (swiper.params.navigation as NavigationOptions).nextEl = nextRef.current;
            (swiper.params.navigation as NavigationOptions).prevEl = prevRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
      >
        {sliderArray.map((slide, index) => (
          <SwiperSlide key={index} style={{ width: `${swiperWidth}rem` }}>
            <Link to={slide.link} className={styled["card-link"]}>
              <img src={slide.imgSrc} alt="Promotion Image" className={styled["card-img"]} />
              {slide.badgeText && <p className={styled["badge"]}>{slide.badgeText}</p>}
              {slide.title && <h2 className={styled["card-title"]}>{slide.title}</h2>}
              {slide.isButton && (
                <button className={styled["card-button"]}>
                  <FontAwesomeIcon icon={faArrowRight} className={styled["card-button-icon"]} />
                </button>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination + Navigation bên ngoài */}
      {showNavPagination && (
        <>
          <div ref={paginationRef} className={styled["custom-pagination"]}></div>
          <div className={styled["nav-buttons"]}>
            <button ref={prevRef} className={`${styled["nav-prev"]} ${styled["nav-btn"]}`}>
              {"<"}
            </button>
            <button ref={nextRef} className={`${styled["nav-next"]} ${styled["nav-btn"]}`}>
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;
