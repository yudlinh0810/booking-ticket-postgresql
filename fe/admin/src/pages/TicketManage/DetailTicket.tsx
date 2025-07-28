import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { fetchTicketById } from "../../services/ticket.service";
import styles from "../../styles/ticketUD.module.scss";
import { paymentStatusMap, paymentTypeMap } from "../../types/ticket";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const DetailTicket = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicketById(id ?? "0"),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    document.title = `Chi tiết vé xe`;
  });

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!data) return <p className={styles.error}>Không tìm thấy thông tin vé mà bạn tìm</p>;

  return (
    <div className={styles.container}>
      <div className={styles.feats}>
        <Link to={`/ticket-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <Link
          to={`/ticket-manage/update/${data.id}`}
          className={`${styles["btn-back"]} ${styles.btn}`}
        >
          Chỉnh sửa
        </Link>
      </div>

      <div className={styles.update}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Chi tiết Vé xe</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Mã giao dịch:</p>
            <p className={styles.data}>{data.transactionId ?? "N/A"}</p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Thông tin khách hàng:</p>
            <div className={styles["info-ctm-container"]}>
              <div className={`${styles.buyer} ${styles["info-ctm"]}`}>
                <h5 className={`${styles["info-ctm-title"]}`}>
                  Người mua{" "}
                  <Link to={`/customer-manage/detail/${data.buyer.id}`}>
                    <FontAwesomeIcon icon={faEye} />
                  </Link>{" "}
                </h5>
                <div className={styles["info-ctm-wrapper"]}>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Email:</p>
                    <p className={styles["info-value"]}>{data.buyer.email}</p>
                  </div>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Họ và tên:</p>
                    <p className={styles["info-value"]}>{data.buyer.fullName}</p>
                  </div>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Số điện thoại:</p>
                    <p className={styles["info-value"]}>{data.buyer.phone}</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.receiver} ${styles["info-ctm"]}`}>
                <h5 className={`${styles["info-ctm-title"]}`}>Người nhận</h5>
                <div className={styles["info-ctm-wrapper"]}>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Email:</p>
                    <p className={styles["info-value"]}>{data.receiver.email}</p>
                  </div>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Họ và tên:</p>
                    <p className={styles["info-value"]}>{data.receiver.fullName}</p>
                  </div>
                  <div className={styles["info-detail"]}>
                    <p className={styles["info-label"]}>Số điện thoại:</p>
                    <p className={styles["info-value"]}>{data.receiver.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>
              Chuyến xe{" "}
              <Link to={`/trip-manage/detail/${data.trip.id}`}>
                <FontAwesomeIcon icon={faEye} />
              </Link>{" "}
            </p>
            <p className={styles.data}> {data.trip.name} </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Số Ghế:</p>
            <p className={styles.data}>
              {data.seats
                .split("-")
                .map((s) => s)
                .join(", ")}
            </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Giá tiền:</p>
            <p className={styles.data}>{formatCurrency(data.price)}</p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Thanh toán:</p>
            <ul className={styles["payment-list"]}>
              <li className={styles.item}>
                {/* <label className={styles.label}>Loại:</label> */}
                <p className={`${styles[data.paymentType]} ${styles.value}`}>
                  {paymentTypeMap?.[data.paymentType] || "Không xác định"}
                </p>
              </li>
              <li className={styles.item}>
                {/* <label className={styles.label}>Trạng thái:</label> */}
                <p className={`${styles[data.paymentStatus]} ${styles.value} ${styles.white}`}>
                  {paymentStatusMap?.[data.paymentStatus] || "Không xác định"}
                </p>
              </li>
            </ul>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Thời gian đặt vé:</p>
            <p className={styles.data}>{formatDate(data.updateAt, "DD-MM-YYYY-HH:mm")}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailTicket;
