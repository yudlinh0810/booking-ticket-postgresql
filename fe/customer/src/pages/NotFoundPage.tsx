// src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/pages/notFoundPage.module.scss";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.notify}>
        <p className={styles.statusCode}>404</p>
        <div className={styles.divider}></div>
        <p className={styles.message}>Trang này không tìm thấy.</p>
      </div>
      <Link to={"/"} className={styles.homeLink}>
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
