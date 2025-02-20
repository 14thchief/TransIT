import { UseFormRegister, FieldValues } from "react-hook-form";
import { startCase } from "lodash";
import { TextAreaProps as TextAreaInputProps } from "../FormElement/types";

type TextAreaProps = TextAreaInputProps & {
  register: UseFormRegister<FieldValues>;
};

const TextArea = ({
  register,
  fieldName,
  fieldLabel,
  required,
  isValidated,
  validateFn,
  handleKeyDown,
  defaultValue,
  placeholder = true,
  isDisabled,
}: TextAreaProps) => {
  return (
    <div>
      <textarea
        id={fieldName}
        defaultValue={defaultValue as string | number | readonly string[] | undefined}
        placeholder={
          placeholder
            ? typeof placeholder === "string"
              ? placeholder
              : `Enter ${
                  fieldLabel?.toLowerCase() || startCase(fieldName).toLowerCase()
                }...`
            : ""
        }
        {...register(fieldName, {
          required: required ? "This field is required." : false,
          validate: isValidated ? validateFn : undefined,
        })}
        onKeyDown={handleKeyDown}
        autoComplete="on"
        rows={3}
        disabled={isDisabled}
      />
    </div>
  );
};

export default TextArea;
