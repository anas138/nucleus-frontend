import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";
import { ElNotification } from "element-plus";

export default class UploadService {
  @catchApiError
  public static async uploadProfilePicture(file: File) {
    const formData: any = new FormData();
    formData.append("file", file);

    const response = await ApiService.post("/upload", formData);
    const url = response.data.data.url;

    return ApiService.put("auth/update-user", {
      profile_picture: url,
    } as any).then(() => {
      ElNotification({
        title: "Success",
        message: `Profile Picture Updated.`,
        type: "success",
      });
    });
  }
}
