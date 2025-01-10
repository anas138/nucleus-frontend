import { catchApiError } from "../decorators/catchApiError";
import { INceNetworkElement } from "../interface/nce-network-element-interface";
import { INokiaTXNNetworkElement } from "../interface/nokia-txn-network-element-interface";
import ApiService from "./ApiService";

export default class NokiaTXNService {
  @catchApiError
  public static async getAllDevices(): Promise<INokiaTXNNetworkElement[]> {
    const response = await ApiService.get("nokia-txn-network-element");
    return response.data.data;
  }
  @catchApiError
  public static async syncDevices() {
    const response = await ApiService.axiosInstance.put(
      "nokia-txn-network-element/sync"
    );
    return response?.data?.data?.message;
  }
  @catchApiError
  public static async getAllAlarmNames() {
    const response = await ApiService.get(
      "alarm-filter-config",
      "NOKIA_TXN/alarm-name"
    );
    return response.data.data;
  }
}
