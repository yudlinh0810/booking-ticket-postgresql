import React from "react";
import styled from "../styles/components/inputField.module.scss";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  label,
  onChange,
  required = false,
}) => {
  return (
    <div className={styled["input-field-container"]}>
      <input
        type={type}
        id={id}
        name={name}
        className={styled["input"]}
        placeholder=" "
        required={required}
        onChange={onChange}
      />
      <label className={styled["label"]} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default InputField;
