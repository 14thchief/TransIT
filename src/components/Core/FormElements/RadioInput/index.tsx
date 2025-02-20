import { startCase } from "lodash";
import { FieldValues, UseFormRegister } from "react-hook-form";
import styles from "./_styles.module.scss";

type RadioInputProps = {
	fieldName: string;
	fieldLabel?: string;
	options: string[] | { title: string; description?: string }[];
	optionLabel?: string;
	optionValue?: string;
	withDescription?: boolean;
	required?: boolean;
	register: UseFormRegister<FieldValues>;
	onChangeFn?: (value: string | number, index: number) => void;
	defaultChecked?: string | number | boolean;
	defaultValue?: string | number | object;
};
const RadioInput = ({
	fieldName,
	register,
	required,
	options,
	withDescription,
	// defaultChecked,
	defaultValue,
	onChangeFn,
}: RadioInputProps) => {
	return (
		<div className={styles.radio_options}>
			{options.map((option, index) => {
				const radio = typeof option === "object" ? option.title : option;
				const description =
					typeof option === "object" && withDescription
						? option.description
						: null;
				return (
					<div
						className={`${styles.radio} ${
							typeof option === "object" ? styles.desc : ""
						}`}
						key={index}
					>
						<input
							type="radio"
							id={radio}
							value={radio}
							defaultChecked={radio === defaultValue}
							{...register(fieldName, {
								required: required ? "This field is required." : false,
							})}
							onClick={() => onChangeFn && onChangeFn(radio, index)}
						/>
						<label htmlFor={radio}>
							{startCase(radio)} <p>{description}</p>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default RadioInput;
