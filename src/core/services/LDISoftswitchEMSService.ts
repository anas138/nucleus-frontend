import { catchApiError } from "../decorators/catchApiError";
import { ILDISoftswitchEMSTrunkGroup } from "../interface/ldi-softswitch-ems-trunk-group-interface";
import { INceNetworkElement } from "../interface/nce-network-element-interface";
import { INokiaTXNNetworkElement } from "../interface/nokia-txn-network-element-interface";
import ApiService from "./ApiService";

export default class LDISoftswitchEMSService {
  @catchApiError
  public static async getAllTrunks(): Promise<ILDISoftswitchEMSTrunkGroup[]> {
    const response = await ApiService.get("ldi-softswitch/trunk");
    return response.data.data;
  }
  @catchApiError
  public static async syncTrunks() {
    const response = await ApiService.axiosInstance.put(
      "nokia-txn-network-element/sync"
    );
    return response?.data?.data?.message;
  }
  @catchApiError
  public static async getAllAlarmNames() {
    const response = await ApiService.get(
      "alarm-filter-config",
      "LDI_SOFTSWITCH_EMS/alarm-name"
    );
    return response.data.data;
  }
  @catchApiError
  public static async getAllAlarm() {
    const response = await ApiService.get(
      "alarm-filter-config/app-type",
      "LDI_SOFTSWITCH_EMS?status=active"
    );
    return response.data.data;
  }
}
