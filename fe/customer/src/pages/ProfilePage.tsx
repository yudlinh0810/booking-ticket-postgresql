import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ButtonField from "../components/ButtonField";
import DateInput from "../components/DateInput";
import InputField from "../components/InputFileld";
import SelectField from "../components/SelectField";
import { useFilePreview } from "../hooks/useFilePreview";
import { fetchUserDetail, updateUser } from "../services/userServices.service";
import { useUserStore } from "../store/userStore";
import { useUiStore } from "../store/useUIStore";
import styles from "../styles/pages/profilePage.module.scss";
import { User } from "../types/user";

const sexOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { isLoading, setLoading } = useUiStore();

  const [fileAvatar, setFileAvatar] = useState<File | null>(null);

  const tempAvatarUrl = useFilePreview(fileAvatar);

  const [serverAvatarUrl, setServerAvatarUrl] = useState<string>(user?.avatar || "");

  const [dataUser, setDataUser] = useState<Partial<User>>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    avatar: "",
    date_birth: new Date().toISOString().split("T")[0],
    sex: "male",
    address: "",
  });

  const displayAvatar = tempAvatarUrl || serverAvatarUrl;

  useEffect(() => {
    document.title = "Trang cá nhân";
    if (user && user.id) {
      handleProfile();
    } else if (user === null) {
      navigate("/");
    }
  }, [user]);

  const handleProfile = async () => {
    const detailUser = await fetchUserDetail();
    const formattedDate = moment(detailUser?.date_birth).format("YYYY-MM-DD");
    if (detailUser.url_img) {
      console.log("Server URL:", detailUser);
      setServerAvatarUrl(detailUser.url_img);
    }

    setDataUser({
      email: user?.email || "",
      first_name: detailUser?.first_name || "",
      last_name: detailUser?.last_name || "",
      phone: detailUser?.phone || "",
      date_birth: formattedDate || dayjs().format("YYYY-MM-DD"),
      sex: detailUser?.sex || "male",
      address: detailUser?.address || "",
      avatar: detailUser?.url_img || "",
    });
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDataUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChangeValue = (value: string, name: string) => {
    setDataUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnchangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileAvatar(null);
      return;
    }

    setFileAvatar(file);
  };

  const handleChangeDate = useCallback((date: string) => {
    setDataUser((prev) => ({ ...prev, date_birth: date }));
  }, []);

  const handleUpdateUser = async () => {
    // Validate trước khi setLoading
    if (dataUser.date_birth && !dayjs(dataUser.date_birth).isValid()) {
      toast.error("Ngày sinh không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      if (user?.id) {
        const formData = new FormData();
        if (fileAvatar) {
          formData.append("avatar", fileAvatar);
        }
        formData.append("data", JSON.stringify(dataUser));
        const res = await updateUser(user.id, formData);

        if (res && res.status === "OK") {
          const formattedDate = moment(res?.data?.date_birth).format("YYYY-MM-DD");
          const data = {
            ...res?.data,
            date_birth: formattedDate,
          };

          setServerAvatarUrl(res?.data?.url_img);
          setFileAvatar(null);

          setDataUser(data);
          setUser(data);
          toast.success("Bạn đã cập nhật thành công!");
        } else {
          toast.error("Cập nhật thất bại!");
        }
      }
    } catch (error) {
      console.log("Lỗi: ", error);
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.account}>
          {dataUser ? (
            <div className={styles.account__card}>
              <div className={styles.account__avatar}>
                <div className={styles["account__avatar-actions"]}>
                  <img
                    src={displayAvatar || "/default-avatar.png"}
                    className={styles["account__avatar-actions-img"]}
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  <input
                    id="avatar"
                    // hidden
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleOnchangeAvatar}
                  />
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className={styles["account__avatar-actions-icon"]}
                  />
                </div>
                <p className={styles.account__note}>
                  Dung lượng file tối đa 1 MB
                  <br />
                  Định dạng: .JPEG, .PNG
                </p>
              </div>

              <div className={styles.account__info}>
                <div className={styles["account__info-input"]}>
                  {/* Email */}
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={dataUser?.email || ""}
                    readOnly={true}
                    onChange={handleChangeValue}
                  />

                  {/* Họ và tên */}
                  <div className={styles["account__info-full-name"]}>
                    <InputField
                      id="last_name"
                      label="Họ"
                      type="text"
                      name="last_name"
                      value={dataUser?.last_name || ""}
                      onChange={handleChangeValue}
                    />
                    <InputField
                      id="first_name"
                      label="Tên"
                      type="text"
                      name="first_name"
                      value={dataUser?.first_name || ""}
                      onChange={handleChangeValue}
                    />
                  </div>

                  {/* Số điện thoại */}
                  <InputField
                    id="phone"
                    label="Số điện thoại:"
                    type="text"
                    name="phone"
                    value={dataUser?.phone || ""}
                    onChange={handleChangeValue}
                  />

                  <SelectField
                    id="sex"
                    name="sex"
                    label="Giới tính:"
                    value={dataUser?.sex || ""}
                    options={sexOptions}
                    onChange={(value) => handleSelectChangeValue(value, "sex")}
                  />
                  {/* Ngày sinh (Sử dụng DateInput riêng biệt) */}
                  <div className={styles.info__item}>
                    <label className={styles.label}>Ngày sinh:</label>
                    <DateInput
                      className={styles.input}
                      valueIn={dataUser?.date_birth}
                      name="date_birth"
                      onChange={handleChangeDate}
                    />
                  </div>

                  {/* Địa chỉ */}
                  <InputField
                    id="address"
                    label="Địa chỉ"
                    type="text"
                    name="address"
                    value={dataUser?.address || ""}
                    onChange={handleChangeValue}
                  />
                </div>
                <div className={styles["account__info-actions"]}>
                  <ButtonField label="Cập nhật" onClick={handleUpdateUser} disabled={isLoading} />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
