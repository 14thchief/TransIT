import { FieldValues, UseFormRegister } from "react-hook-form";
import styles from "./_styles.module.scss";
import { CheckBoxProps } from "../FormElement/types";

type CheckInputProps = CheckBoxProps & {
	register: UseFormRegister<FieldValues>;
};

const CheckBox = ({
	fieldName,
	fieldLabel,
	jsxFieldLabel,
	register,
	required,
	defaultChecked,
	onChangeFn,
}: CheckInputProps) => {
	return (
		<div className={`${styles.checkbox}`}>
			<input
				id={fieldName}
				type="checkbox"
				defaultChecked={defaultChecked}
				{...register(fieldName, {
					required: required ? "This field is required." : false,
				})}
				onChange={({ target: { checked } }) =>
					onChangeFn && onChangeFn(checked)
				}
			/>
			{fieldLabel ||
				(jsxFieldLabel && (
					<label htmlFor={fieldName}>
						{jsxFieldLabel ? jsxFieldLabel : fieldLabel}
					</label>
				))}
		</div>
	);
};

export default CheckBox;
