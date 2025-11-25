import { Select } from "antd";
import React from "react";
import "../styles/selectFieldStyles.scss";

const { Option } = Select;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: SelectOption[];
  required?: boolean;
  disable?: boolean;
  onChange: (value: string) => void;
}

const AntdSelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  options,
  disable = false,
  onChange,
}) => {
  return (
    <div className={"select-field-container"}>
      <label className={"label"} htmlFor={id}>
        {label}
      </label>

      <Select
        id={id}
        value={value || undefined}
        onChange={onChange}
        disabled={disable}
        className={"antd-select-override"}
        placeholder={`-- Chọn ${label.toLowerCase()} --`}
        style={{ width: "100%" }}
        data-name={name}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default AntdSelectField;
