import { AppConstants } from "@/constants/app-constants";
import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";

export default class GlobalSettingService {
  @catchApiError
  public static async getAppVersion() {
    const response = await ApiService.get(
      `global-settings/${AppConstants.GLOBAL_SETTING_TYPES.CRM_WEB_APP_VERSION}`,
      `single-by-key?key=app_version`
    );
    return response;
  }

  @catchApiError
  public static async getUserGlobalSettings(id: number) {
    const response = await ApiService.get(
      `global-settings/${AppConstants.GLOBAL_SETTING_TYPES.USER_NOTIFICATION}`,
      `single-by-condition?condition_value=${id}`
    );
    return response.data;
  }

  @catchApiError
  public static async updateUserGlobalSettings(
    id: number,
    type: string,
    payload
  ) {
    const response = await ApiService.put(
      `global-settings?global_setting_type_id=${AppConstants.GLOBAL_SETTING_TYPES.USER_NOTIFICATION}&condition_value=${id}&key=${type}`,
      payload
    );
    return response.data;
  }

  @catchApiError
  public static async getAlarmGlobalSettings(appType: string) {
    const response = await ApiService.get(
      `global-settings/${AppConstants.GLOBAL_SETTING_TYPES.ALARM_FILTER_CONFIG_SETTINGS}`,
      `single-by-condition?condition_value=${appType}`
    );
    return response.data;
  }
}
