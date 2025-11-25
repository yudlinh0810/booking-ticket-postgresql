import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { memo, useEffect, useState } from "react";
import styled from "../styles/components/dateInput.module.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateInputProps {
  valueIn?: string | Date;
  name?: string;
  className?: string;
  onChange: (time: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ valueIn, className, name, onChange }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    const VIETNAM_TZ = "Asia/Ho_Chi_Minh";
    if (valueIn) {
      const dateStr = typeof valueIn === "string" ? valueIn : dayjs(valueIn).format("YYYY-MM-DD");
      const parsed = dayjs(dateStr);
      // Kiểm tra valid trước khi set
      if (parsed.isValid()) {
        setDateValue(parsed);
      }
    } else {
      const todayInVN = dayjs.tz(VIETNAM_TZ).startOf("day");
      setDateValue(todayInVN);
      onChange(todayInVN.format("YYYY-MM-DD"));
    }
  }, [valueIn]);

  const handleChangeDate = (date: Dayjs | null) => {
    setDateValue(date);
    // Chỉ gọi onChange khi date hợp lệ
    if (date && date.isValid()) {
      onChange(date.format("YYYY-MM-DD"));
    } else {
      onChange("");
    }
  };

  return (
    <div className={`${styled["date-input-container"]} ${className || ""}`}>
      <DatePicker
        id="date"
        name={name}
        className={styled.datePicker}
        variant="borderless"
        format="DD-MM-YYYY"
        value={dateValue}
        onChange={handleChangeDate}
      />
    </div>
  );
};

export default memo(DateInput);
