import { ElNotification } from "element-plus";

export function ElNotificationSuccess(message: string) {
  ElNotification({
    title: "Success",
    message: `${message || "Resource Created"}`,
    type: "success",
  });
}

export function ElNotificationError(message: string) {
  ElNotification({
    title: "Error",
    message: `${message || "Error"}`,
    type: "error",
  });
}

export function ElNotificationNetworkError(message: string) {
  ElNotification({
    title: "Network Error",
    message: `${message || "Error"}`,
    type: "error",
  });
}
