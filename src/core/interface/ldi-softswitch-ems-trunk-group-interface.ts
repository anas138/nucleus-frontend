export interface ILDISoftswitchEMSTrunkGroup {
  id: number;
  trunk_name: string;
  peer_end_ip: string;
  ldi_ip: string;
  status: string;
  record_status: string;
  created_by: string | Date;
  updated_by: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}
