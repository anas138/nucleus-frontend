import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";

export default class ObserviumService {
  @catchApiError
  public static async getAllDevices() {
    const response = await ApiService.get("obs-device");
    return response.data.data;
  }
  @catchApiError
  public static async syncDevices() {
    const response = await ApiService.axiosInstance.put("obs-device/sync");
    return response?.data?.message;
  }
  @catchApiError
  public static async getAllAlarmNames() {
    const response = await ApiService.get(
      "alarm-filter-config",
      "OBSERVIUM/alarm-name"
    );
    return response.data.data;
  }

  public static async getPortBitsGraph(
    portId: number,
    period: string,
    height = "150",
    width = "200"
  ) {
    const queryObj = { period, height, width };
    const url = `obs-device/graphs/port-bits/${portId}?${new URLSearchParams(
      queryObj
    ).toString()}`;
    const content = await ApiService.axiosInstance.get(url, {
      responseType: "blob",
    });
    return content;
  }
}
