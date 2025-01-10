import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";
import { ElNotification } from "element-plus";
import DownloadService from "./DownloadServices";
import {
  removeEmptyStringValuesFromObject,
  removeNullValuesFromArray,
  replaceUnderScoreInKeysWithSpacesForArray,
} from "../helpers/utils";

export default class ReportService {
  public static async downloadTroubleTicketReport(data) {
    const url = "report/trouble-ticket/generate-csv";
    const payload = removeEmptyStringValuesFromObject(data);
    // const payloadWithUnderscoreKeys = removeNullValuesFromArray(nullishPayload);
    // const payload = replaceUnderScoreInKeysWithSpacesForArray(
    //   payloadWithUnderscoreKeys
    // );
    // const queryParams = new URLSearchParams(payload).toString();
    // const queryParams = JSON.stringify(payload);
    // url = queryParams ? url + `${queryParams}` : url;
    const fileName = "trouble-ticket-report";
    return DownloadService.downloadFileFromServer(url, payload, fileName)
      .then(() => {
        return true;
      })
      .catch((error) => {
        ElNotification({
          title: "Error",
          message: error?.response?.data?.message,
          type: "error",
        });
        return false;
      });
  }
}
