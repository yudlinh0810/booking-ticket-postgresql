import styled from "../styles/components/inputField.module.scss";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  required?: boolean;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type,
  value = "",
  required = false,
  readOnly = false,
  onChange,
}) => {
  return (
    <div className={styled["input-field-container"]}>
      <input
        type={type}
        id={id}
        name={name}
        className={styled["input"]}
        placeholder=" "
        value={value}
        required={required}
        readOnly={readOnly}
        onChange={onChange}
      />
      <label className={styled["label"]} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default InputField;
