import axios from "axios";
import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";
import { ElNotification } from "element-plus";
import JwtService from "./JwtService";

export default class DownloadService {
  public static async downloadFileFromServer(
    url,
    payload,
    fileName,
    download = true,
    ext = "csv",
    contentType = ""
  ) {
    return new Promise((resolve, reject) => {
      console.log("URL", url);
      ApiService.axiosInstance
        .post(url, payload, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: contentType });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          if (download) {
            link.download = `${fileName}.${ext}`;
          } else {
            link.target = "_blank";
          }
          link.click();
          URL.revokeObjectURL(link.href);
          resolve(true);
        })
        .catch((err) => {
          console.log(err, "fileError");
          reject(err);
        });
    });
  }
}
