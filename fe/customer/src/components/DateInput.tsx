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
  className?: string;
  onChange: (time: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ valueIn, className, onChange }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    // Nếu có giá trị đầu vào (string hoặc Date)
    const VIETNAM_TZ = "Asia/Ho_Chi_Minh";
    if (valueIn) {
      const dateStr = typeof valueIn === "string" ? valueIn : dayjs(valueIn).format("YYYY-MM-DD");
      setDateValue(dayjs(dateStr));
    } else {
      // Nếu không có thì set mặc định là ngày hiện tại
      const todayInVN = dayjs.tz(VIETNAM_TZ).startOf("day");
      setDateValue(todayInVN);
      onChange(todayInVN.format("YYYY-MM-DD"));
    }
  }, [valueIn, onChange]);

  const handleChangeDate = (date: Dayjs | null) => {
    setDateValue(date);
    onChange(date ? date.format("YYYY-MM-DD") : "");
  };

  return (
    <div className={`${styled.input} ${className || ""}`}>
      <DatePicker
        id="date"
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
