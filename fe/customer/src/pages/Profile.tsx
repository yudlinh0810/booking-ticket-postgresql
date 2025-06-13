import { useEffect, useState } from "react";
import styles from "../styles/profile.module.scss";
import { useUserStore } from "../store/userStore";
import { User } from "../types/user";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { updateDetailUser, updateUserNoImage } from "../services/auth.service";
import moment from "moment";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [avatar, setAvatar] = useState<string>(user?.avatar || "");
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);
  const [dataUser, setDataUser] = useState<User>({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    dateBirth: "",
    sex: "male",
    address: "",
  });

  useEffect(() => {
    if (user) {
      const formattedDate = moment(user?.dateBirth).format("YYYY-MM-DD");
      setDataUser({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        avatar: user?.avatar || "",
        dateBirth: formattedDate || "",
        sex: user?.sex || "male",
        address: user?.address || "",
      });
    } else {
      navigate("/login");
    }
  }, []);

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
                <input
                  className={styles["input"]}
                  type="date"
                  name="dateBirth"
                  value={dataUser?.dateBirth}
                  onChange={handleChangeValue}
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
