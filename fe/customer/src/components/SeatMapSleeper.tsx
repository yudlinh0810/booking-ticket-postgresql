import { useEffect, useRef, useState } from "react";
import styles from "../styles/seatMapSleeper.module.scss";
import Seat, { SeatType } from "./Seat";
import { message } from "antd";

const SeatMapSleeper = ({
  initialSeats,
  date, // Note: 'date < date.now()' is not selectable
  onSelected,
}: {
  initialSeats: SeatType[];
  date: string;
  onSelected: (seats: SeatType[]) => void;
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

  const renderFloor = (floor: "top" | "bottom") => {
    const floorSeats = seats.filter((seat) => seat.floor === floor);
    const rows: SeatType[][] = [];

    let i = 0;
    rows.push([floorSeats[i++], floorSeats[i++]]);

    while (i < floorSeats.length) {
      const row: SeatType[] = [];
      if (i < floorSeats.length) row.push(floorSeats[i++]); // trái
      if (i < floorSeats.length) row.push(floorSeats[i++]); // giữa
      if (i < floorSeats.length) row.push(floorSeats[i++]); // phải
      rows.push(row);
    }

    return (
      <div className={styles.floor}>
        <h3 className={styles.title}>{floor === "bottom" ? "Tầng dưới" : "Tầng trên"}</h3>
        <div className={styles["floor-rows"]}>
          {rows.map((row, rowIndex) => (
            <div className={styles["seat-row"]} key={rowIndex}>
              {row.map((seat) => (
                <Seat
                  key={seat.position}
                  seatValue={seat}
                  date={date}
                  onSelected={handleSelectedSeat}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles["sleeper-bus"]}>
      {renderFloor("bottom")}
      {renderFloor("top")}
    </div>
  );
};

export default SeatMapSleeper;
