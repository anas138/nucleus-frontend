import { AppConstants } from "@/constants/app-constants";
import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";
import CurdApiService from "./CurdApiService";

export default class AppNotificationService {
  @catchApiError
  public static async getAppNotification() {
    const response = await CurdApiService.getAll("app-notification", {
      limit: AppConstants.NOTIFICATION_LIST.PER_PAGE_LIMIT,
    });
    return response.data.data;
  }

  @catchApiError
  public static async getAppNotificationUnSeenCount() {
    const response = await ApiService.get("app-notification/unseen");
    return response.data.data;
  }

  @catchApiError
  public static async markAllUnSeen() {
    const response = await ApiService.put("app-notification/is_seen", {});
    return response.data;
  }

  @catchApiError
  public static async markIsOpen(id: number, data) {
    const response = await ApiService.patch(
      `app-notification/${id}/is-open`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async clearAllNotification(id: number) {
    const response = await CurdApiService.deleteResource(
      "app-notification/user",
      id
    );
    return response.data;
  }
}
