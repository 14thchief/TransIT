import { Controller, FieldValues, Control } from "react-hook-form";
import Select from "react-select";
import { startCase } from "lodash";
import { SelectProps } from "../FormElement/types";
import { formatReactSelectStyles } from "../FormElement/data";

type SelectInputProps = SelectProps & {
	control: Control<FieldValues>;
	getOptionLabel?: (label: string) => string;
	getOptionValue?: (value: string) => string;
};

const SelectInput = ({
	optionsData,
	getOptionLabel,
	getOptionValue,
	fieldName,
	fieldLabel,
	defaultValue,
	placeholder = true,
	control,
	required,
	isDisabled,
	validateFn,
	onChangeFn,
}: SelectInputProps) => {
	const formatOptions = (data: object[] | string[]) => {
		return data.map((item) => {
			if (typeof item === "string") {
				return { value: item, label: item };
			} else {
				return item;
			}
		});
	};

	const options = formatOptions(optionsData);

	return (
		<div>
			<Controller
				name={fieldName}
				control={control}
				defaultValue={defaultValue}
				rules={{
					required: required ? "This field is required." : false,
					validate: validateFn,
				}}
				render={({ field }) => (
					<Select
						{...field}
						inputId={fieldName}
						options={options}
						getOptionLabel={getOptionLabel}
						getOptionValue={getOptionValue}
						value={field.value}
						placeholder={
							placeholder
								? typeof placeholder === "string"
									? placeholder
									: `Select ${
											fieldLabel?.toLowerCase() || startCase(fieldName)
									  }...`
								: null
						}
						onChange={(value) => {
							field.onChange(value);
							onChangeFn ? onChangeFn(value) : null;
						}}
						isSearchable
						isClearable
						closeMenuOnSelect
						blurInputOnSelect
						className={"select_container"}
						classNamePrefix={"selected"}
						theme={(theme) => ({
							...theme,
							colors: {
								...theme.colors,
								primary25: "#eeffee",
								primary: "#fff",
							},
						})}
						styles={formatReactSelectStyles}
						isDisabled={isDisabled}
					/>
				)}
			/>
		</div>
	);
};

export default SelectInput;
