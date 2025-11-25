import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import styles from "../styles/components/paymentSuccess.module.scss";
import { DataPaymentSuccess } from "../types/payment";
import { formatCurrency } from "../utils/formatCurrency";
import { useQueryClient } from "@tanstack/react-query";
import SliderTicket from "./SliderTicket";

interface PaymentSuccessProps {
  data: DataPaymentSuccess[];
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ data }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data[0].paymentStatus === "paid") {
      queryClient.refetchQueries({
        queryKey: ["trip"],
      });
    }
  }, [data, queryClient]);

  return (
    <>
      {data[0].paymentStatus === "paid" && (
        <div className={styles["payment-success-container"]}>
          <FontAwesomeIcon icon={faCheck} className={styles["ic-success"]} />
          <div className={`${styles.center}`}>
            <h2 className={styles.title}>Mua vé xe thành công</h2>
          </div>
          <div className={`${styles.center}`}>
            <p>
              VEXETIENICH đã gửi thông tin về địa chỉ email
              <strong className={`${styles["recei-email"]}`}>{data[0].email}</strong>
              Vui lòng kiểm tra lại
            </p>
          </div>
          <div className={styles["booked-ticket-info"]}>
            <div className={styles["booked-ticket-title"]}>
              <h3 className={styles.title}>Thông tin vé</h3>
            </div>
            <div className={styles["booked-ticket-body"]}>
              <div className={styles["ticket-info"]}>
                <div className={styles["ticket-info__user"]}>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="fullName" className={styles["ticket-info__user-detail-label"]}>
                      Họ và tên
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="fullName">
                      {data[0].fullName}
                    </strong>
                  </div>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="phone" className={styles["ticket-info__user-detail-label"]}>
                      Số điện thoại
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="phone">
                      {data[0].phone}
                    </strong>
                  </div>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="email" className={styles["ticket-info__user-detail-label"]}>
                      Email
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="email">
                      {data[0].email}
                    </strong>
                  </div>
                </div>
                <div className={styles["ticket-info__payment"]}>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label
                      htmlFor="totalPrice"
                      className={styles["ticket-info__payment-detail-label"]}
                    >
                      Tổng giá vé
                    </label>
                    <strong
                      className={styles["ticket-info__payment-detail-content"]}
                      id="totalPrice"
                    >
                      {formatCurrency(data.reduce((sum, tk) => sum + Number(tk.price), 0))}
                      <sup>vnd</sup>
                    </strong>
                  </div>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label
                      htmlFor="paymenType"
                      className={styles["ticket-info__payment-detail-label"]}
                    >
                      PTTT
                    </label>
                    <strong
                      className={styles["ticket-info__payment-detail-content"]}
                      id="paymenType"
                    >
                      Banking
                    </strong>
                  </div>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label htmlFor="email" className={styles["ticket-info__payment-detail-label"]}>
                      Trạng thái
                    </label>
                    <strong className={styles["ticket-info__payment-detail-content"]} id="email">
                      Thanh toán thành công
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            {data && <SliderTicket sliderTicketArray={data} swiperWidth={18} />}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentSuccess;
