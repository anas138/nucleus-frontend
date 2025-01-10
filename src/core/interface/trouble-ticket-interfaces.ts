interface Attachments {
  document_type: string | undefined;
  id: number;
  name: string;
  url: string;
}

export interface TroubleTicket {
  case_title: string | null;
  description: string | null;
  alarm_id: number | null;
  alarm_config_id: number | null;
  trouble_ticket_category_id: number | null;
  trouble_ticket_sub_category_id: number | null;
  total_tat: number | null;
  department_id: number | null;
  sub_department_id: number | null;
  attachment: Attachments[] | null;
  priority_level: number | null;
}

export interface UpdateTroubleTicket {
  status?: number | null;
  trouble_ticket_category_id?: number | null;
  trouble_ticket_sub_category_id?: number | null;
  sub_department_id: number | null;
  assigned_to_id: number | null;
  attachment?: Attachments[] | null;
  comment: string | null;
  resolution_reason: string | null;
  resolution_comment: string | null;
  is_rca_required: boolean | null;
  rca_reason: string | null;
  corrective_action: string | null;
  preventive_step: string | null;
  rca_start_time: Date | null;
  rca_end_time: Date | null;
  pause_start_time: Date | null;
  pause_end_time: Date | null;
  pause_reason: string | null;
  priority_level: number | null;
}
