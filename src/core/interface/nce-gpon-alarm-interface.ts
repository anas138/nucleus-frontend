export interface INceGponNetworkElement {
  ip_address: string;
  region: any;
  product_name: string;
  parent_subnet: any;
}
export interface INceGponAlert {
  id: number;
  severity: string;
  category: string;
  event_type: string;
  nce_alarm_id: number;
  alarm_text: string;
  alarm_type: null | string;
  layer: string;
  md_name: string;
  alarm_serial_number: string;
  native_probable_cause: string;
  probable_cause: string;
  location_info: string;
  ne_name: string;
  ne_resource_id: string;
  ltp_resource_id: null | string;
  resource_type: string;
  product_type: string;
  other_info: string;
  impacted_resource: null | string;
  trail_name: null | string;
  fiber_name: null | string;
  created_on: string;
  cleared_on: string;
  last_changed_on: string;
  is_cleared: boolean;
  acknowledged_on: null | string;
  is_seen: boolean;
  network_element: any;
  alarm_filter_config_id?: number;
  region?: string;
  style?: any;
  troubleTicket?: any;
  // eslint-disable-next-line
  onClick?: Function;
  nceGponNetworkElement: INceGponNetworkElement;
}
