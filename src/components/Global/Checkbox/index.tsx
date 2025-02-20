import React from "react";
import { CustomCheckboxProps } from "./types";
import styles from "./_styles.module.scss";

const Checkbox: React.FC<CustomCheckboxProps> = ({
  checked = false,
  onToggle,
  label,
}) => {
  const handleChange = () => {
    onToggle && onToggle(!checked);
  };

  return (
    <div className={styles.checkbox_container}>
      <div
        className={`${styles.checkbox} ${checked ? styles.active : ""}`}
        onClick={handleChange}
      />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Checkbox;
