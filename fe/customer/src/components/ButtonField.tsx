import styles from "../styles/components/buttonField.module.scss";

interface ButtonFieldProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ButtonField: React.FC<ButtonFieldProps> = ({ label, onClick, disabled }) => {
  return (
    <button className={styles["button"]} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default ButtonField;
