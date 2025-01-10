import { catchApiError } from "../decorators/catchApiError";
import { INceNetworkElement } from "../interface/nce-network-element-interface";
import ApiService from "./ApiService";

export default class NceGponService {
  @catchApiError
  public static async getAllDevices(): Promise<INceNetworkElement[]> {
    const response = await ApiService.get("nce-gpon-network-element");
    return response.data.data;
  }
  @catchApiError
  public static async syncDevices() {
    const response = await ApiService.axiosInstance.put(
      "nce-gpon-network-element/sync"
    );
    return response?.data?.data?.message;
  }
  @catchApiError
  public static async getAllAlarmNames() {
    const response = await ApiService.get(
      "alarm-filter-config",
      "NCE_GPON/alarm-name"
    );
    return response.data.data;
  }
}
