import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { memo, useEffect, useState } from "react";
import styled from "../styles/dateInputForSeachTrip.module.scss";

interface DateInputProps {
  title: string;
  valueIn?: string;
  onChange: (time: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ title, valueIn, onChange }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (valueIn) {
      setDateValue(dayjs(valueIn));
    } else {
      const today = dayjs().startOf("day");
      // Chỉ set và onChange khi dateValue khác với ngày hiện tại
      if (!dateValue || !dateValue.isSame(today, "day")) {
        setDateValue(today);
        onChange(today.format("YYYY-MM-DD"));
      }
    }
  }, [valueIn]);

  const handleChangeDate = (date: Dayjs | null) => {
    setDateValue(date);
    onChange(date ? date.format("YYYY-MM-DD") : "");
  };

  return (
    <div className={styled["date-input-container"]}>
      <div className={styled["ic-date"]}>
        <FontAwesomeIcon className={styled.ic} icon={faCalendarDay} />
      </div>
      <div className={styled["date-input"]}>
        <label className={styled.title}>{title}</label>
        <DatePicker
          name="date-departure"
          id="date"
          className={styled["date-departure"]}
          value={dateValue}
          onChange={handleChangeDate}
          format="YYYY-MM-DD"
        />
      </div>
    </div>
  );
};

export default memo(DateInput);
