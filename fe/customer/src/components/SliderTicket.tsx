import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../styles/components/sliderTicket.module.scss";
import { DataPaymentSuccess } from "../types/payment";
import { faDownload, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { message, QRCode } from "antd";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

interface SliderProps {
  sliderTicketArray: DataPaymentSuccess[];
  swiperWidth?: number;
}

const SliderTicket: React.FC<SliderProps> = ({ sliderTicketArray, swiperWidth = 40 }) => {
  const handleDownloadQR = (qrCodeValue: string) => {
    const elementId = `qr-container-${qrCodeValue}`;
    const qrElement = document.getElementById(elementId);

    if (!qrElement) {
      message.error("Tải mã QR thất bại, không tìm thấy container QR.");
      return;
    }

    const qrCanvas = qrElement.querySelector("canvas");

    if (qrCanvas) {
      const timestamp = new Date().getTime();
      const filename = `QR_VeXe_${qrCodeValue}_${timestamp}.png`;

      const url = qrCanvas.toDataURL("image/png");
      const aTag = document.createElement("a");

      aTag.href = url;
      aTag.download = filename;

      document.body.appendChild(aTag);
      aTag.click();
      document.body.removeChild(aTag);
      message.success(`Tải mã QR cho vé ${qrCodeValue} thành công (Tên file: ${filename})`);
    } else {
      message.error("Tải mã QR thất bại, không tìm thấy hình ảnh QR.");
    }
  };

  const handleShareQR = () => {
    message.info("Chức năng chia sẻ mã QR đang được phát triển.");
  };

  return (
    <div className={styles["swiper-container"]}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={"auto"}
        className={styles["custom-swiper"]}
      >
        {sliderTicketArray.map((t, index) => {
          const qrCodeValue = `${t.id}-${t.seatPosition}`;

          return (
            <SwiperSlide key={index} style={{ width: `${swiperWidth}rem` }}>
              <div className={styles["ticket-info__seats-wrapper"]}>
                <div className={styles["ticket-info__seats"]}>
                  <div key={`${t.id}-${index}`} className={styles["ticket-info__seat-item"]}>
                    <div className={styles["ticket-info__seat-item__actions"]}>
                      <button type="button">
                        <FontAwesomeIcon
                          icon={faDownload}
                          className={styles.ic}
                          onClick={() => handleDownloadQR(qrCodeValue)}
                        />
                      </button>
                      <h3
                        className={styles["ticket-info__seat-item__actions-title"]}
                      >{`Mã vé ${qrCodeValue}`}</h3>
                      <button type="button">
                        <FontAwesomeIcon
                          icon={faShareFromSquare}
                          className={styles.ic}
                          onClick={handleShareQR}
                        />
                      </button>
                    </div>
                    <div
                      id={`qr-container-${qrCodeValue}`}
                      className={styles["ticket-info__seat-item__qr"]}
                    >
                      <QRCode value={qrCodeValue} size={120} />
                    </div>
                    <div className={styles["ticket-info__seat-item-info"]}>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Tuyến xe</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {`${t.departure} - ${t.arrival}`}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Thời gian</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {formatDate(t.startTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Số ghế</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {t.seatPosition}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Điểm lên xe</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {`Bến xe ${t.departure}`}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Giá vé</p>
                        <strong className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {formatCurrency(t.price)}
                          <sup>vnd</sup>
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SliderTicket;
