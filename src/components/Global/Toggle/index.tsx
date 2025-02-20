import ReactSwitch from "react-switch";
import styles from "./_styles.module.scss";

type ToggleProps = {
  id: string | number;
  checked: boolean;
  offColor?: string;
  onColor?: string;
  onChange: (value: boolean) => void;
};

const Toggle = ({
  id,
  checked = false,
  offColor = "#cdcdcd",
  onColor = "#0085ff",
  onChange,
}: ToggleProps) => {
  return (
    <div className={styles.switch}>
      <ReactSwitch
        id={`status ${id || ""}`}
        checked={checked}
        checkedIcon={false}
        uncheckedIcon={false}
        offColor={offColor}
        onColor={onColor}
        onChange={onChange}
      />
    </div>
  );
};

export default Toggle;
