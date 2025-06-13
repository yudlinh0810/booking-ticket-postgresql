import { Outlet } from "react-router";
import styles from "../styles/manageLayout.module.scss";
import Sidebar from "../components/Sidebar";
const ManageLayout = () => {
  return (
    <div className={styles["manage-layout"]}>
      <div className={styles["sidebar-wrapper"]}>
        <Sidebar />
      </div>
      <div className={styles.children}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
