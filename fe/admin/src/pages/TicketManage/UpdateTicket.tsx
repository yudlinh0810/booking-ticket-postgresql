import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { fetchTicketById, updateTicket } from "../../services/ticket.service";
import styles from "../../styles/ticketUD.module.scss";
import { paymentStatusMap, paymentTypeMap, DataUpdateTicket } from "../../types/ticket";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const UpdateTicket = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicketById(id ?? "0"),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const [valueUpdateTicet, setValueUpdateTicket] = useState<DataUpdateTicket>({
    id: data?.id ?? 0,
    paymentStatus: data?.paymentStatus,
    paymentType: data?.paymentType,
  });

  useEffect(() => {
    document.title = `Cập nhật vé xe`;
  });

  const handlePageBack = () => {
    navigate(-1);
  };

  const handleChangeValueTicet = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setValueUpdateTicket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdateTicket = async () => {
    if (
      !valueUpdateTicet.id ||
      valueUpdateTicet.id === 0 ||
      (valueUpdateTicet.paymentStatus === data?.paymentStatus &&
        valueUpdateTicet.paymentType === data?.paymentType)
    )
      return;

    try {
      const response = await updateTicket(valueUpdateTicet);
      if (response.status === "OK") {
        navigate("/ticket-manage");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!data) return <p className={styles.error}>Không tìm thấy thông tin vé mà bạn tìm</p>;

  return (
    <div className={styles.container}>
      <div className={styles.feats}>
        <button onClick={handlePageBack} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </button>
        <Link
          to={`/ticket-manage/update/${data.id}`}
          className={`${styles["btn-back"]} ${styles.btn}`}
        >
          Xóa
        </Link>
      </div>

      <div className={styles.update}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Cập nhật Vé xe</h2>
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
                <select
                  name="paymentType"
                  id="payment-type"
                  className={`${styles.value}`}
                  value={valueUpdateTicet.paymentType}
                  onChange={handleChangeValueTicet}
                >
                  {Object.entries(paymentTypeMap)
                    .filter((status) => status[0] != "all")
                    .map(([key, value]) => (
                      <option key={key} value={key} className={`${styles[data.paymentType]}`}>
                        {value}
                      </option>
                    ))}
                </select>
              </li>
              <li className={styles.item}>
                <select
                  name="paymentStatus"
                  id="payment-status"
                  className={`${styles.value}`}
                  value={valueUpdateTicet.paymentStatus}
                  onChange={handleChangeValueTicet}
                >
                  {Object.entries(paymentStatusMap)
                    .filter((status) => status[0] != "all")
                    .map(([key, value]) => (
                      <option key={key} value={key} className={`${styles[data.paymentStatus]}`}>
                        {value}
                      </option>
                    ))}
                </select>
              </li>
            </ul>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Thời gian đặt vé:</p>
            <p className={styles.data}>{formatDate(data.updateAt, "DD-MM-YYYY-HH:mm")}</p>
          </li>
          <li className={styles["feat-update"]}>
            <button
              className={`${styles["btn-update"]} ${styles.btn}`}
              onClick={handleUpdateTicket}
              disabled={!valueUpdateTicet.id || valueUpdateTicet.id === 0}
            >
              Cập nhật
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UpdateTicket;
