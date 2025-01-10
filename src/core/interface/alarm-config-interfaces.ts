export interface IBasicAlarmConfig {
  alarm_name: String;
  severity: String;
  is_regional_escalation: Boolean;
  email_escalation_delay: Number;
  ticket_escalation_delay: Number;
  is_email_escalation: Boolean;
  is_ticket_escalation: Boolean;
  record_status: String;
  description: string;
  is_change_in_display_severity?: Boolean;
  conditional_severity?: String;
  severity_to_be_displayed?: String;
}
