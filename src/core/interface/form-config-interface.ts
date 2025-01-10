import { FieldInterface } from "@/components/forms/interfaceField";

export interface IFormConfig {
  title: string;
  fields: FieldInterface[];
  actionButton?: "enabled" | "disabled";
  validationSchema: any;
}
