import { useEffect, useState } from "react";
import styles from "../styles/profile.module.scss";
import { useUserStore } from "../store/userStore";
import { User } from "../types/user";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { updateDetailUser, updateUserNoImage } from "../services/auth.service";
import moment from "moment";
import dayjs from "dayjs";
import DateInput from "../components/DateInput";
import { fetchUser } from "../services/userServices.service";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [avatar, setAvatar] = useState<string>(user?.avatar || "");
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);
  const [dataUser, setDataUser] = useState<Partial<User>>({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    dateBirth: new Date().toISOString().split("T")[0],
    sex: "male",
    address: "",
  });

  useEffect(() => {
    document.title = "Trang cá nhân";
    if (user) {
      handleProfile();
    } else {
      navigate("/login");
    }
  }, []);

  const handleProfile = async () => {
    const detailUser = await fetchUser();
    const formattedDate = moment(user?.dateBirth).format("YYYY-MM-DD");
    setDataUser({
      fullName: detailUser?.fullName || "",
      email: user?.email || "",
      phone: detailUser?.phone || "",
      avatar: detailUser?.urlImg || "",
      dateBirth: formattedDate || dayjs().format("YYYY-MM-DD"),
      sex: detailUser?.sex || "male",
      address: detailUser?.address || "",
    });
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDataUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnchangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAvatar(file);
    console.log("file", URL.createObjectURL(file));
    setAvatar(URL.createObjectURL(file));
  };

  const handleChangeDate = (date: string) => {
    setDataUser((prev) => ({ ...prev, dateBirth: date }));
  };

  const handleUpdateUser = async () => {
    try {
      if (fileAvatar) {
        if (user !== dataUser) {
          const formData = new FormData();
          formData.append("data", JSON.stringify(dataUser));
          formData.append("file", fileAvatar);

          const res = await updateDetailUser(formData);

          if (res && res.status === "OK") {
            const formattedDate = moment(res?.user?.dateBirth).format("YYYY-MM-DD");
            const data = {
              ...res?.user,
              dateBirth: formattedDate,
            };

            setAvatar(res?.user?.urlImg);
            setDataUser(data);
            setUser(res?.user);
            toast.success("Bạn đã cập nhật thành công!");
          } else {
            toast.error("Cập nhật thất bại!");
          }
        }
      } else {
        const res = await updateUserNoImage(dataUser);

        if (res && res.status === "OK") {
          const formattedDate = moment(res?.user?.dateBirth).format("YYYY-MM-DD");
          const data = {
            ...res?.user,
            dateBirth: formattedDate,
          };

          setDataUser(data);
          setUser(res?.user);
          toast.success("Bạn đã cập nhật thành công!");
        } else {
          toast.error("Cập nhật thất bại!");
        }
      }
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.account}>
        {dataUser ? (
          <div className={styles.account__card}>
            <div className={styles.account__avatar}>
              <img src={avatar} alt="Avatar" />
              <input
                id="avatar"
                hidden
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => handleOnchangeAvatar(e)}
              />
              <label htmlFor="avatar" className={styles.label}>
                Chọn ảnh
              </label>
              <p className={styles.account__note}>
                Dung lượng file tối đa 1 MB
                <br />
                Định dạng: .JPEG, .PNG
              </p>
            </div>

            <div className={styles.account__info}>
              <div className={styles.info__item}>
                <label className={styles.label}>Email:</label>
                <input
                  className={styles["input"]}
                  type="text"
                  placeholder="Email"
                  value={dataUser?.email}
                  onChange={handleChangeValue}
                  disabled
                />
              </div>
              <div className={styles.info__item}>
                <label className={styles.label}>Họ và tên:</label>
                <input
                  className={styles["input"]}
                  type="text"
                  placeholder="Họ và tên"
                  name="fullName"
                  value={dataUser?.fullName}
                  onChange={handleChangeValue}
                />
              </div>
              <div className={styles.info__item}>
                <label className={styles.label}>Số điện thoại:</label>
                <input
                  className={styles["input"]}
                  type="text"
                  placeholder="Điện thoại"
                  name="phone"
                  value={dataUser?.phone}
                  onChange={handleChangeValue}
                />
              </div>
              <div className={styles.info__item}>
                <label className={styles.label}>Giới tính:</label>
                <select
                  className={styles["input"]}
                  name="sex"
                  onChange={handleChangeValue}
                  value={dataUser.sex}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className={styles.info__item}>
                <label className={styles.label}>Ngày sinh:</label>
                <DateInput
                  valueIn={dataUser?.dateBirth}
                  className={styles.input}
                  onChange={handleChangeDate}
                />
              </div>
              <div className={styles.info__item}>
                <label className={styles.label}>Địa chỉ:</label>
                <input
                  className={styles["input"]}
                  type="text"
                  name="address"
                  value={dataUser?.address}
                  onChange={handleChangeValue}
                />
              </div>
              <button className={styles.account__updateBtn} onClick={handleUpdateUser}>
                Cập nhật
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Profile;
