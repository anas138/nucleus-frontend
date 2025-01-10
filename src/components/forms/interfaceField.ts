import { Component } from "vue";

export interface FieldInterface {
  label: string;
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "range"
    | "radio"
    | "dropdown"
    | "checkbox"
    | "textarea"
    | "component";
  props?: any; // only for component
  component?: Component; // only when type is component
  placeholder?: string;
  required?: boolean;
  value: any;
  editable: boolean;
  validate: boolean;
  clearable?: boolean;
  min?: number; // Required for type "range"
  max?: number; // Required for type "range"
  step?: number; // Required for type "range"
  options?: { label: string; value: string }[] | any; // Required for type "radio" and "dropdown"
  multiSelect?: boolean; // Required for type "dropdown"
  onChange?: Function;
  hint?: string;
}
