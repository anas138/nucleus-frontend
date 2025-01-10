import ApiService from "../services/ApiService";
import { ElNotificationNetworkError } from "../helpers/ElNotification.utils";
import { AppConstants } from "@/constants/app-constants";

export function catchApiError<T>(
  _,
  __,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (this: any, ...args: any[]) {
    await ApiService.setHeader();
    try {
      const result = await originalMethod!.apply(this, args);
      return result;
    } catch (error: any) {
      console.log(error.response);
      return (
        (error.response && Promise.reject(error)) ??
        ElNotificationNetworkError(AppConstants.SERVER_DOWN_ERROR)
      );
    }
  };
}
