import seatActive from "../assets/images/seat_active.svg";
import seatSelecting from "../assets/images/seat_selecting.svg";
import seatDisable from "../assets/images/seat_disabled.svg";
import styles from "../styles/seat.module.scss";
import React from "react";
import { message } from "antd";

export type SeatType = {
  id?: number;
  position: string;
  status: "available" | "selecting" | "unavailable" | "booked";
  tripId?: number;
  floor?: "top" | "bottom";
};
interface SeatProps {
  seatValue: SeatType;
  date: string; // Note: 'date < date.now()' is not selectable
  onSelected: (item: SeatType) => void;
}

const Seat: React.FC<SeatProps> = React.memo(({ seatValue, date, onSelected }) => {
  const { position, status } = seatValue;

  const handleToggleStatus = () => {
    let newStatus;
    if (date < new Date().toISOString()) {
      message.warning("Chuyến đã khởi hành, không thể chọn ghế");
      return;
    }

    if (status === "available") {
      newStatus = "selecting";
    } else {
      newStatus = "available";
    }
    const updateSeat: SeatType = {
      ...seatValue,
      status: newStatus as "available" | "selecting",
    };
    onSelected(updateSeat);
  };
  if (status === "unavailable" || status === "booked") {
    return (
      <div className={styles.seat}>
        <span className={styles["seat__position"]}>{position}</span>
        <img src={seatDisable} alt={`img${status}`} className={styles["seat__img"]} />
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.seat} ${
          date < new Date().toISOString() ? styles["cancel"] : styles[""]
        }`}
        onClick={handleToggleStatus}
      >
        <span className={styles["seat__position"]}>{position}</span>
        <img
          src={`${status === "available" ? seatActive : seatSelecting}`}
          className={styles["seat__img"]}
          alt={`img${status}`}
        />
      </div>
    );
  }
});

export default Seat;
