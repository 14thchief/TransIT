import { DynamicFormFieldErrorProps, GetFieldTypeProps } from "./types";
import TextInput from "../TextInput";
import TextArea from "../TextArea";
import SwitchInput from "../SwitchInput";
import PhoneNumber from "../PhoneNumber";
import SelectInput from "../SelectInput";
import { CSSObjectWithLabel, ControlProps } from "react-select";
import RadioInput from "../RadioInput";
import CheckBox from "../CheckBox";
import FileUpload from "../FileUpload";

export const getFieldType = ({
  register,
  control,
  fieldName,
  fieldLabel,
  type,
  required,
  isValidated,
  validateFn,
  onChangeFn,
  handleKeyDown,
  defaultValue,
  placeholder,
  isDisabled,
  maxLength,
  optionsData,
  labelKey,
  valueKey,
  returnOnlyValue,
  // clearSelected,
  radioOptions,
  withDescription,
  defaultChecked,
  defaultStatus,
  controlled,
  controlledCheck,
  tooltip,
  jsxFieldLabel,
  resetState,
}: GetFieldTypeProps) => {
  let content: React.ReactNode = null;

  switch (type) {
    case "text":
    case "number":
    case "date":
    case "password":
    case "email":
      content = (
        <TextInput
          type={type}
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          register={register}
          required={required}
          isValidated={isValidated}
          validateFn={validateFn}
          handleKeyDown={handleKeyDown}
          defaultValue={defaultValue}
          placeholder={placeholder}
          isDisabled={isDisabled}
          tooltip={tooltip}
          onChangeFn={onChangeFn}
        />
      );
      break;

    case "textarea":
      content = (
        <TextArea
          type={type}
          register={register}
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          required={required}
          isValidated={isValidated}
          validateFn={validateFn}
          handleKeyDown={handleKeyDown}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
        />
      );
      break;

    case "phone":
      content = (
        <PhoneNumber
          type={type}
          control={control}
          fieldName={fieldName}
          maxLength={maxLength}
          required={required}
          isDisabled={isDisabled}
        />
      );
      break;

    case "select":
      content = (
        <SelectInput
          type={type}
          control={control}
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          required={required}
          isValidated={isValidated}
          optionsData={optionsData}
          labelKey={labelKey}
          valueKey={valueKey}
          returnOnlyValue={returnOnlyValue}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          onChangeFn={onChangeFn}
        />
      );
      break;

    // case "multi-select":
    //   content = (
    //     <MultiSelect
    //       type={type}
    //       register={register}
    //       fieldName={fieldName}
    //       fieldLabel={fieldLabel}
    //       required={required}
    //       isValidated={isValidated}
    //       optionsData={optionsData}
    //       labelKey={labelKey}
    //       valueKey={valueKey}
    //       clearSelected={clearSelected}
    //       defaultValue={defaultValue}
    //       isDisabled={isDisabled}
    //     />
    //   );
    //   break;

    case "radio-options":
      content = (
        <RadioInput
          register={register}
          fieldName={fieldName}
          fieldLabel={fieldLabel as string}
          required={required}
          options={radioOptions}
          withDescription={withDescription}
          defaultChecked={defaultChecked}
          defaultValue={defaultValue}
          onChangeFn={onChangeFn}
        />
      );
      break;

    case "switch":
      content = (
        <SwitchInput
          type={type}
          control={control}
          fieldName={fieldName}
          defaultStatus={defaultStatus}
          controlled={controlled}
          controlledCheck={controlledCheck}
          onChangeFn={onChangeFn}
        />
      );
      break;

    case "checkbox":
      content = (
        <CheckBox
          type={type}
          register={register}
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          required={required}
          defaultChecked={defaultChecked}
          jsxFieldLabel={jsxFieldLabel}
        />
      );
      break;

    case "file-upload":
      content = (
        <FileUpload
          type={type}
          register={register}
          fieldName={fieldName}
          fieldLabel={fieldLabel}
          required={required}
          onChangeFn={onChangeFn}
          resetState={resetState}
        />
      );
      break;

    default:
      break;
  }

  return { content, type };
};

export const dynamicFormFieldError = ({
  dynamic,
  errors,
}: DynamicFormFieldErrorProps) => {
  let errorMessage = "";
  if (dynamic && errors) {
    if (dynamic.grandParent) {
      if (
        dynamic.grandParentType === "array" &&
        typeof dynamic.parentIndex === "number"
      ) {
        if (dynamic.type === "array") {
          errorMessage =
            errors[dynamic.grandParent]?.[dynamic.parentIndex]?.[
              dynamic.parent
            ]?.[dynamic.index]?.[dynamic.fieldName]?.message;
        } else {
          errorMessage =
            errors[dynamic.grandParent]?.[dynamic.parentIndex]?.[
              dynamic.parent
            ]?.[dynamic.fieldName]?.message;
        }
      } else if (dynamic.grandParentType === "object") {
        if (dynamic.type === "array") {
          errorMessage =
            errors[dynamic.grandParent]?.[dynamic.parent]?.[dynamic.index]?.[
              dynamic.fieldName
            ]?.message;
        } else {
          errorMessage =
            errors[dynamic.grandParent]?.[dynamic.parent]?.[dynamic.fieldName]
              ?.message;
        }
      }
    } else {
      if (dynamic.type === "array") {
        errorMessage =
          errors[dynamic.parent]?.[dynamic.index]?.[dynamic.fieldName]?.message;
      } else {
        errorMessage = errors[dynamic.parent]?.[dynamic.fieldName]?.message;
      }
    }
    return errorMessage;
  } else {
    return null;
  }
};

export const formatReactSelectStyles = {
  control: (
    baseStyles: CSSObjectWithLabel,
    state: ControlProps<any, false, any>
  ) => ({
    ...baseStyles,
    border: "none",
    minWidth: "100%",
    minHeight: "fit-content",
    backgroundColor: state.isDisabled ? "transparent" : "transparent",
  }),
  valueContainer: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    padding: 0,
    border: "none",
    outline: "none",
  }),
  input: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    margin: 0,
    padding: 0,
    border: "none",
    outline: "none",
  }),
  placeholder: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: "#ced6de",
    fontFamily: "Roboto",
  }),
  menu: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    marginTop: "1.2rem",
    color: "#414141",
  }),
  option: (baseStyles: CSSObjectWithLabel, state: any) => ({
    ...baseStyles,
    cursor: "pointer",
    backgroundColor: state.isSelected ? "#eef6f0" : "white",
    color: state.isSelected ? "#1b7232" : "#414141",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () =>
    ({
      position: "relative",
      // right: "1rem",
      // bottom: "0.8rem",
      color: "#ced6de",
      cursor: "pointer",
    } as CSSObjectWithLabel),
  clearIndicator: () =>
    ({
      position: "relative",
      // right: "2.5rem",
      // bottom: "0.8rem",
      color: "#ced6de",
      cursor: "pointer",
    } as CSSObjectWithLabel),
};
