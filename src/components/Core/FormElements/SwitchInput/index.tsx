import Toggle from "components/Global/Toggle";
import { Controller, Control, FieldValues } from "react-hook-form";
import styles from "./_styles.module.scss";
import { SwitchProps } from "../FormElement/types";

type SwitchInputProps = SwitchProps & {
  control: Control<FieldValues>;
};

const SwitchInput = ({
  control,
  fieldName,
  defaultStatus = false,
  controlled = false,
  controlledCheck,
  checkedLabel,
  uncheckedLabel,
  withoutLabel,
  onChangeFn,
}: SwitchInputProps) => {
  const id = Math.random();
  return (
    <Controller
      name={fieldName || "status"}
      control={control}
      defaultValue={controlled ? controlledCheck : defaultStatus}
      render={({ field }) => (
        <div className={withoutLabel ? styles.no_border : styles.status_field}>
          <Toggle
            id={id}
            checked={controlled ? controlledCheck : field.value}
            onChange={(value) => {
              if (controlled) {
                onChangeFn && onChangeFn(value);
              } else {
                field.onChange(value);
                onChangeFn && onChangeFn(value);
              }
            }}
          />
          <p>
            {controlled
              ? controlledCheck
                ? checkedLabel || "Active"
                : uncheckedLabel || "Inactive"
              : field.value
              ? checkedLabel || "Active"
              : uncheckedLabel || "Inactive"}
          </p>
        </div>
      )}
    />
  );
};

export default SwitchInput;
