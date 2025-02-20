import { startCase } from "lodash";
import { FormElementProps } from "./types";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { dynamicFormFieldError, getFieldType } from "./data";

const FormElement = (props: FormElementProps) => {
  const { fieldName, fieldLabel, required, dynamic, hideLabel } = props;

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const dynamicError = dynamicFormFieldError({ dynamic, errors });

  const { content, type } = getFieldType({ register, control, ...props });

  return (
    <div className="input_main">
      {type === "checkbox" || type === "file-upload" ? (
        <>
          {type === "file-upload" && !!fieldLabel && !hideLabel && (
            <label htmlFor={fieldName} className="label">
              {fieldLabel || startCase(fieldName)}
              {required && <span>*</span>}
            </label>
          )}

          {content}
        </>
      ) : (
        <div className="input_body">
          {!hideLabel && (
            <label htmlFor={fieldName} className="label">
              {fieldLabel || startCase(fieldName)}
              {required && <span>*</span>}
            </label>
          )}
          {content}
        </div>
      )}

      {dynamicError ? (
        <p className="error">{dynamicError}</p>
      ) : (
        errors[fieldName] && (
          <ErrorMessage
            errors={errors}
            name={fieldName}
            render={({ message }) => <p className="error">{message}</p>}
          />
        )
      )}
    </div>
  );
};
export default FormElement;
