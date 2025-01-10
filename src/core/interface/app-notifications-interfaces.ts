export interface AppNotifications {
  id: number;
  related_id: number;
  related_table: string;
  message: string;
  record_status: string;
  user_id: number;
  sub_department_id: number;
  is_seen: true;
  is_open: true;
  route: string;
  link: string;
  created_by: number;
  updated_by: number;
}
