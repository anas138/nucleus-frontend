import { AxiosResponse } from "axios";
import { catchApiError } from "../decorators/catchApiError";
import { IEmailService } from "../interface/email-service-interface";
import ApiService from "./ApiService";
import { ISendEmailBody } from "../interface/send-email-body";

export default class AlarmEmailService implements IEmailService {
  @catchApiError
  public async getEmailTemplate(
    appType: "nce" | "obs" | "nce-gpon" | "nokia-txn" | "ldi-softswitch",
    id: number
  ): Promise<AxiosResponse<AxiosResponse<any>>> {
    const emailDomain =
      appType === "nce" || appType === "nokia-txn"
        ? `${appType}-alarms`
        : appType === "obs"
        ? `${appType}-alerts`
        : `${appType}-alarms`;
    const response = await ApiService.axiosInstance.get(
      `/${emailDomain}/template/${id}`
    );
    return response.data.data;
  }
  @catchApiError
  public async sendEmail(
    appType: "nce" | "obs" | "nce-gpon" | "nokia-txn" | "ldi-softswitch",
    id: number,
    data: ISendEmailBody
  ): Promise<AxiosResponse<AxiosResponse<any>>> {
    const emailDomain =
      appType === "nce" || appType === "nokia-txn"
        ? `${appType}-alarms`
        : appType === "obs"
        ? `${appType}-alerts`
        : `${appType}-alarms`;
    const response = await ApiService.axiosInstance.post(
      `/${emailDomain}/send-email/${id}`,
      data
    );
    return response;
  }
}
