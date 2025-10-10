import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { fetchCustomer } from "../../services/customer.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Loading from "../../components/Loading";
import DefaultImage from "../../components/DefaultImage";
import { dateTimeTransform } from "../../utils/transform";

const DetailCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", idFetch],
    queryFn: () => fetchCustomer(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const customer = data ?? null;

  const handlePageBack = () => {
    navigate(-1);
  };

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!customer) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <button onClick={handlePageBack} className={styles["btn-back"]}>
          Quay lại
        </button>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/customer-manage/update/${customer?.id}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
            <button className={`${styles["btn-delete"]} ${styles["feat-item"]}`}>Xóa</button>
          </div>
        </div>
        <ul className={styles.detail}>
          <li className={`${styles["item__img"]} ${styles.group}`}>
            <p className={styles.title}>Ảnh đại diện</p>
            <div className={styles.img}>
              <DefaultImage src={customer?.urlImg} />
            </div>
          </li>
          {[
            { label: "email", value: customer?.email },
            { label: "họ và tên", value: customer?.fullName },
            {
              label: "giới tính",
              value: customer?.sex === "male" ? "Nam" : customer?.sex === "female" ? "Nữ" : "Khác",
            },
            { label: "số điện thoại", value: customer?.phone },
            {
              label: "ngày sinh",
              value: dateTimeTransform(customer?.dateBirth, "DD-MM-YYYY", false),
            },
            { label: "Đăng ký bằng", value: customer?.provider },
            { label: "địa chỉ", value: customer?.address },
            { label: "ngày tạo", value: customer?.createAt },
            { label: "ngày cập nhật", value: customer?.updateAt },
          ].map((item, index) => (
            <li key={index} className={styles.group}>
              <p className={styles.title}>{item.label}</p>
              <input className={styles.data} value={item.value ?? "N/A"} readOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailCustomer;
