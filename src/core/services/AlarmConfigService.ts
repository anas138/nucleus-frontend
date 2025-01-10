import { catchApiError } from "../decorators/catchApiError";
import { prepareDataForServer, proxyToObject } from "../helpers/utils";
import { QueryParams } from "../interface/interfaces";
import ApiService from "./ApiService";
import CurdApiService from "./CurdApiService";

export default class AlarmConfigService {
  @catchApiError
  public static async createAlarmConfig(data) {
    const response = await CurdApiService.createResource(
      proxyToObject(data),
      "alarm-filter-config"
    );
    return response;
  }
  @catchApiError
  public static async getAllAlarmsConfig(
    appType: string,
    queryParms: QueryParams = {}
  ) {
    queryParms = prepareDataForServer(queryParms);
    const response = await ApiService.axiosInstance.get(
      "alarm-filter-config/app-type/" + appType,
      { params: { ...queryParms } }
    );
    return response.data.data;
  }
  @catchApiError
  public static async getAlarmsConfigById(id: number) {
    const response = await ApiService.axiosInstance.get(
      "alarm-filter-config/" + id
    );
    return response.data.data;
  }
  @catchApiError
  public static async updateAlarmConfig(data, id) {
    const response = await CurdApiService.editResource(
      proxyToObject(data),
      "alarm-filter-config",
      id
    );
    return response;
  }
  @catchApiError
  public static async deleteAdvCondition(id) {
    const response = await CurdApiService.deleteResource(
      "alarm-filter-advance-conditions",
      id
    );
    return response;
  }
  @catchApiError
  public static async deleteAlarmRecipient(id) {
    const response = await CurdApiService.deleteResource(
      "alarm-recipients",
      id
    );
    return response;
  }

  @catchApiError
  public static async getAlarmsConfigByNameAndSeverity(
    name: string,
    severity: string,
    appType: string
  ) {
    const response = await ApiService.axiosInstance.get(
      `alarm-filter-config/app-type/${appType.toUpperCase()}/single?alarm_name=${name}&severity=${severity}`
    );
    return response.data.data;
  }
}
