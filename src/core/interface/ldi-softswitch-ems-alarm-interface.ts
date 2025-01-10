export interface ILDISoftswitchEMSAlart {
  id: number;
  ems_alarm_id: string;
  alarm_filter_config: any;
  alarm_filter_config_id: number;
  category: string;
  event_time: string; // ISO 8601 datetime string
  source_ip: string;
  severity: string;
  actual_severity: string;
  class_txt: string;
  syslog_ip: string;
  syslog_source: string;
  error_code: string;
  message: string;
  message_state: string;
  alarm_type: number;
  trunk_group: string;
  type_txt: string;
  subtype_txt: string;
  ldi_softswitch_trunk_group_id: number;
  ldiSoftswitchTrunkGroup: any;
  record_status: string;
  created_by: string | null; // Nullable field
  updated_by: string | null; // Nullable field
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
  created_on: string;
  cleared_on: string;
  is_cleared: boolean;
  troubleTicket?: any;
}
