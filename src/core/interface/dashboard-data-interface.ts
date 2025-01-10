export interface MainMenuList {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  permission?: string;
  list?: boolean;
  pages: any[];
}

export interface DashboardList {
  key: number;
  label: string;
}
