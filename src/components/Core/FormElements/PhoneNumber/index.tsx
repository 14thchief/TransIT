import { FieldValues, Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { PhoneProps } from "../FormElement/types";

type PhoneNumberProps = PhoneProps & {
	control: Control<FieldValues>;
};

const PhoneNumber = ({
	control,
	fieldName,
	required,
	maxLength,
	isDisabled,
}: PhoneNumberProps) => {
	return (
		<PhoneInput
			name={fieldName || "phoneNumber"}
			control={control}
			rules={{
				required: required ? "This field is required." : false,
				maxLength: {
					value: maxLength,
					message: "Invalid phone number",
				},
				minLength: {
					value: maxLength,
					message: "Invalid phone number",
				},
			}}
			international={true}
			defaultCountry="NG"
			countryCallingCodeEditable={false}
			disabled={isDisabled}
		/>
	);
};

export default PhoneNumber;
