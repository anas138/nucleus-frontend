export interface IobserviumAlert {
  id: number;
  alarm_name: string;
  alert_state: string;
  alert_status: string;
  alert_severity: string;
  alert_timestamp: string;
  alert_id: number;
  alert_message: string;
  conditions: string;
  metrics: string;
  duration: string;
  entity_name: string;
  entity_id: number;
  entity_type: string;
  entity_description: string;
  device_hostname: string;
  device_sysname: string;
  device_description: string;
  device_id: number;
  device_hardware: string;
  device_os: string;
  device_type: string;
  device_location: string;
  device_uptime: string;
  device_rebooted: string;
  title: string;
  cleared_on: string | null;
  is_cleared: boolean;
  created_at: string;
  updated_at: string;
  is_seen: boolean;
  style?: any;
  troubleTicket?: any;
  // eslint-disable-next-line
  onClick?: Function;
  alarm_filter_config_id?: number;
  region?: string;
}
