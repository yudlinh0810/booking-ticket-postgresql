import { useEffect, useRef, useState } from "react";
import styles from "../styles/seatMapNormal.module.scss";
import Seat, { SeatType } from "./Seat";
import { message } from "antd";

const SeatMapNormal = ({
  onSelected,
  initialSeats,
}: {
  onSelected: (seats: SeatType[]) => void;
  initialSeats: SeatType[];
}) => {
  const [seats, setSeats] = useState<SeatType[]>(initialSeats);
  const prevSelectedCountRef = useRef(0);

  useEffect(() => {
    const selectedSeats = seats.filter((seat) => seat.status === "selecting");
    const currentSelectedCount = selectedSeats.length;

    if (currentSelectedCount <= 5 || currentSelectedCount < prevSelectedCountRef.current) {
      onSelected(selectedSeats);
      prevSelectedCountRef.current = currentSelectedCount;
    }
  }, [seats, onSelected]);

  const handleSelectedSeat = (updatedSeat: SeatType) => {
    setSeats((prevSeats) => {
      const currentSelectedSeats = prevSeats.filter((seat) => seat.status === "selecting");
      const currentSeat = prevSeats.find((seat) => seat.position === updatedSeat.position);
      const isDeselecting =
        currentSeat?.status === "selecting" && updatedSeat.status !== "selecting";

      if (
        !isDeselecting &&
        currentSelectedSeats.length >= 5 &&
        updatedSeat.status === "selecting"
      ) {
        message.warning("Bạn chỉ có thể chọn tối đa 5 ghế");
        return prevSeats;
      }

      const newSeats = prevSeats.map((seat) =>
        seat.position === updatedSeat.position ? updatedSeat : seat
      );

      return newSeats;
    });
  };

  const renderSeats = (position: "A" | "B") => {
    const seatOfLetter = seats.filter((seat) => seat.position.startsWith(position));
    const rows: SeatType[][] = [];

    let i = 0;

    while (i < seatOfLetter.length) {
      const row: SeatType[] = [];
      if (i < seatOfLetter.length) row.push(seatOfLetter[i++]); // trái
      if (i < seatOfLetter.length) row.push(seatOfLetter[i++]); // phải
      rows.push(row);
    }

    return (
      <div className={styles.floor}>
        <div className={styles["floor-rows"]}>
          {rows.map((row, rowIndex) => (
            <div className={styles["seat-row"]} key={rowIndex}>
              {row.map((seat) => (
                <Seat key={seat.position} seatValue={seat} onSelected={handleSelectedSeat} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles["normal-bus"]}>
      <div className={styles["seat-list"]}>
        {renderSeats("A")}
        {renderSeats("B")}
      </div>
    </div>
  );
};

export default SeatMapNormal;
