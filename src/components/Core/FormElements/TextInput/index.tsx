import { useState } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { startCase } from "lodash";
import { Eye, EyeInvisible } from "src/assets/icons/icons";
import { TextProps } from "../FormElement/types";

type TextInputProps = TextProps & {
	register: UseFormRegister<FieldValues>;
};

const TextInput = ({
	register,
	fieldName,
	fieldLabel,
	type,
	required,
	isValidated,
	validateFn,
	handleKeyDown,
	onChangeFn,
	defaultValue,
	placeholder = true,
	isDisabled,
	tooltip,
}: TextInputProps) => {
	const [password, setPassword] = useState("password");

	return (
		<div>
			<input
				id={fieldName}
				defaultValue={defaultValue as string | number | readonly string[] | undefined}
				type={type === "password" ? password : type}
				placeholder={
					placeholder
						? typeof placeholder === "string"
							? placeholder
							: `Enter ${
									fieldLabel?.toLowerCase() ||
									startCase(fieldName).toLowerCase()
							  }...`
						: ""
				}
				{...register(fieldName, {
					required: required ? "This field is required." : false,
					validate: isValidated ? validateFn : undefined,
					onChange: onChangeFn ? (e) => onChangeFn(e.target.value) : undefined,
					setValueAs: (value: string) => value?.trim(),
				})}
				onKeyDown={handleKeyDown}
				disabled={isDisabled}
				autoComplete="on"
				step="0.01"
			/>
			{type === "password" && (
				<span
					className="password"
					onClick={() =>
						setPassword((prev) => (prev === "password" ? "text" : "password"))
					}
				>
					{password === "password" ? <Eye /> : <EyeInvisible />}
				</span>
			)}

			{tooltip && <span className="tooltip">{tooltip}</span>}
		</div>
	);
};

export default TextInput;
