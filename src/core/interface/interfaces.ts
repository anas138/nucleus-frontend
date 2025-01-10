export interface QueryParams {
  [key: string]: any;
}
export interface PaginatedData {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  list: any[];
}

export interface basicDropDownListValue {
  key: any;
  label: string;
}
