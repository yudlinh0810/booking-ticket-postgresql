import React from "react";
import styles from "../styles/selectType.module.scss";
import { PaymentType } from "../types/ticket";

interface Props {
  selectedType: PaymentType;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectTypeTicket: React.FC<Props> = ({ selectedType, onChange }) => {
  return (
    <div className={styles["filter-type"]}>
      <p className={styles["type-title"]}>Kiểu thanh toán:</p>
      <select className={styles["select-type"]} value={selectedType} onChange={onChange}>
        <option value="all">Tất cả</option>
        <option value="banking">Ngân hàng</option>
        <option value="cash">Tiền mặt</option>
      </select>
    </div>
  );
};

export default SelectTypeTicket;
