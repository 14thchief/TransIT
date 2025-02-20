import { Control, FieldValues, UseFormRegister } from "react-hook-form";

type BaseFormElementProps = {
  fieldName: string;
  fieldLabel?: string;
  hideLabel?: boolean;
  required?: boolean;
  isValidated?: boolean;
  validateFn?: (
    value: string | number,
    prop: unknown
  ) => boolean | string | undefined;
  onChangeFn?: (
    value: string | number | boolean | File | null | undefined
  ) => void;
  handleKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  defaultValue?: string | number | object;
  placeholder?: string | boolean;
  dynamic?: DynamicField;
  isDisabled?: boolean;
  maxLength?: number | undefined;
  optionsData?: object[] | string[] | undefined;
  labelKey?: string | undefined;
  valueKey?: string | undefined;
  returnOnlyValue?: boolean | undefined;
  clearSelected?: boolean | undefined;
  radioOptions?:
    | string[]
    | { title: string; description: string }[]
    | undefined;
  withDescription?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  defaultStatus?: boolean | undefined;
  controlled?: boolean | undefined;
  controlledCheck?: boolean | undefined;
  tooltip?: React.ReactNode;
  jsxFieldLabel?: React.ReactNode;
  resetState?: boolean;
  // withoutLabel?: boolean | undefined;
};

type DynamicField = {
  type: "object" | "array";
  parent: string;
  fieldName: string;
} & ({ type: "array"; index: number } | { type: "object"; index?: number });

export type TextProps = BaseFormElementProps & {
  type: "text" | "number" | "date" | "password" | "email";
};

export type TextAreaProps = BaseFormElementProps & {
  type: "textarea";
};

export type PhoneProps = BaseFormElementProps & {
  type: "phone";
  maxLength?: number;
};

export type SelectProps = BaseFormElementProps & {
  type: "select";
  optionsData: object[] | string[];
  labelKey?: string;
  valueKey?: string;
  returnOnlyValue?: boolean;
};

export type MultiSelectProps = BaseFormElementProps & {
  type: "multi-select";
  optionsData: unknown[];
  labelKey?: string;
  valueKey?: string;
  clearSelected?: boolean;
};

export type RadioOptionsProps = BaseFormElementProps & {
  type: "radio-options";
  withDescription?: boolean;
  radioOptions: string[] | { title: string; description: string }[];
};

export type SwitchProps = BaseFormElementProps & {
  type: "switch";
  defaultStatus: boolean;
  controlled?: boolean;
  controlledCheck?: boolean;
  onChangeFn?: (value: boolean) => void;
  checkedLabel?: string;
  uncheckedLabel?: string;
  withoutLabel?: boolean;
};

export type CheckBoxProps = BaseFormElementProps & {
  type: "checkbox";
  jsxFieldLabel?: React.ReactNode;
  onChangeFn?: (value: boolean) => void;
};

export type FileUploadProps = BaseFormElementProps & {
  type: "file-upload";
  jsxFieldLabel?: React.ReactNode;
  onChangeFn?: (value: File) => void;
  resetState?: boolean;
};

export type FormElementProps =
  | TextProps
  | TextAreaProps
  | PhoneProps
  | SelectProps
  | MultiSelectProps
  | RadioOptionsProps
  | SwitchProps
  | CheckBoxProps
  | FileUploadProps;

export type GetFieldTypeProps = FormElementProps & {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
};

export type DynamicFormField = {
  type: "object" | "array";
  parent: string;
  parentIndex?: number;
  grandParentType?: "object" | "array";
  grandParent?: string;
  fieldName: string;
} & ({ type: "array"; index: number } | { type: "object"; index?: number });

export type DynamicFormFieldErrorProps = {
  errors: any;
  dynamic?: DynamicFormField;
};
