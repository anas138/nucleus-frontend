export const TroubleTicketModel = {
  case_title: null,
  description: null,
  alarm_id: null,
  alarm_config_id: null,
  trouble_ticket_category_id: null,
  trouble_ticket_sub_category_id: null,
  total_tat: null,
  department_id: null,
  sub_department_id: null,
  attachment: null,
  priority_level: null,
};

export const UpdateTroubleTicketModel = {
  status: null,
  trouble_ticket_category_id: null,
  trouble_ticket_sub_category_id: null,
  sub_department_id: null,
  assigned_to_id: null,
  attachment: null,
  resolution_reason: null,
  resolution_comment: null,
  is_rca_required: null,
  rca_reason: null,
  corrective_action: null,
  preventive_step: null,
  rca_start_time: null,
  rca_end_time: null,
  pause_start_time: null,
  pause_end_time: null,
  pause_reason: null,
  comment: null,
  priority_level: null,
};

export const CanAssignTicketModel = {
  trouble_ticket_category_id: null,
  trouble_ticket_sub_category_id: null,
  sub_department_id: null,
  assigned_to_id: null,
  attachment: null,
  comment: null,
};

export const UpdateTicketModel = {
  trouble_ticket_category_id: null,
  trouble_ticket_sub_category_id: null,
  attachment: null,
  comment: null,
};

export const LeaveTicketModel = {
  attachment: null,
  comment: null,
};

export const CancelTicketModel = {
  cancelReason: null,
  comment: null,
};

export const SendBackTicketModel = {
  attachment: null,
  comment: null,
};

export const ReopenTicketModel = {
  sub_department_id: null,
  assigned_to_id: null,
  attachment: null,
  comment: null,
};

export const ResolvedTicketModel = {
  status: null,
  attachment: null,
  comment: null,
  resolution_reason: null,
  resolution_comment: null,
};

export const BulkUpdationModel = {
  status: null,
  resolution_reason: null,
  comment: null,
};

export const ResolutionModel = {
  resolution_reason: null,
  resolution_comment: null,
};

export const CompletedTicketModel = {
  status: null,
  attachment: null,
  comment: null,
};

export const RCARequiredTicketModel = {
  is_rca_required: null,
  comment: null,
  sub_department_id: null,
  attachment: null,
};

export const RCATicketModel = {
  rca_reason: null,
  corrective_action: null,
  preventive_step: null,
  rca_start_time: null,
  rca_end_time: null,
  attachment: null,
  comment: null,
};

export const PauseRequestTicketModel = {
  pause_start_time: null,
  pause_end_time: null,
  pause_reason: null,
  attachment: null,
};

export const PauseRequestApproveTicketModel = {
  pause_start_time: null,
  pause_end_time: null,
  pause_reason: null,
  attachment: null,
  comment: null,
};

export const CancelPauseRequestTicketModel = {
  attachment: null,
  comment: null,
};
