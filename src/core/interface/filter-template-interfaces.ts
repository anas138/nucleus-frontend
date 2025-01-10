import { AppConstants } from "@/constants/app-constants";

type Keys = keyof typeof AppConstants.FILTER_TEMPLATE_TYPES;
export type TemplateType = typeof AppConstants.FILTER_TEMPLATE_TYPES[Keys];

export interface IFiltersTemplateCreate {
  template_type: TemplateType;
  name: string;
  filters_payload: string;
  is_shared?: boolean;
  comment?: string;
}

export interface IFiltersTemplate {
  id: number;
  template_type: TemplateType;
  name: string;
  filters_payload: string;
  is_shared: boolean;
  comment: string;
}
