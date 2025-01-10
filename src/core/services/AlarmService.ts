import { catchApiError } from "../decorators/catchApiError";
import { AlarmDetail } from "../interface/alarm-interfaces";
import ApiService from "./ApiService";

export default class AlarmService {
  @catchApiError
  public static async getAlarmRegion(id: string): Promise<AlarmDetail> {
    const response = await ApiService.get("/regions/alarm", id);
    return response.data.data;
  }

  @catchApiError
  public static async getAllAlarmsNameDropDown() {
    const response = await ApiService.get("alarm-filter-config");
    return response.data.data;
  }
}
