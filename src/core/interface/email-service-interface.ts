import { AxiosResponse } from "axios";
import { ISendEmailBody } from "./send-email-body";

export interface IEmailService {
  getEmailTemplate(appType: "nce" | "obs", id: number): Promise<AxiosResponse>;
  sendEmail(
    appType: string,
    id: number,
    data: ISendEmailBody
  ): Promise<AxiosResponse>;
}
export interface EmailLog {
  logId: number;
  cc: string[] | string | null;
  created_at?: Date;
  from?: string;
  html_body?: string;
  id: number;
  subject: string;
  to: string;
  updated_at?: Date;
}
