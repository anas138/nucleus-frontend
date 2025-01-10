import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { catchApiError } from "../decorators/catchApiError";
import { TroubleTicket } from "../interface/trouble-ticket-interfaces";
import ApiService from "./ApiService";
import CurdApiService from "./CurdApiService";

export default class TroubleTicketService {
  @catchApiError
  public static async getCategoryTurnAroundTime(id: number) {
    const response = await ApiService.get(
      "tt-category",
      `${id}/tat-calculation`
    );

    return response.data.data;
  }

  @catchApiError
  public static async getCategoryById(id: number) {
    const response = await CurdApiService.getById("tt-category", String(id));
    return response.data.data;
  }

  @catchApiError
  public static async createTroubleTicket(payload: TroubleTicket) {
    const response = await CurdApiService.createResource(
      payload,
      "trouble-ticket"
    );
    return response.data;
  }

  @catchApiError
  public static async getTroubleTicketById(id: number) {
    const response = await CurdApiService.getById("trouble-ticket", String(id));
    return response.data.data;
  }

  @catchApiError
  public static async getTroubleTicketActivityLog(id: number) {
    const response = await CurdApiService.getById(
      "trouble-ticket",
      `${id}/activity-log`
    );
    return response.data.data;
  }

  @catchApiError
  public static async getTroubleTicketCommentLog(id: number) {
    const response = await CurdApiService.getById(
      "trouble-ticket",
      `${id}/comment`
    );
    return response.data.data;
  }

  @catchApiError
  public static async setTroubleTicketPriority(id: number, data: any) {
    const response = await ApiService.put(
      `trouble-ticket/${id}/priority`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async addComment(id: number, data) {
    const response = await CurdApiService.createResource(
      data,
      `trouble-ticket/${id}/comment`
    );
    return response.data.data;
  }

  @catchApiError
  public static async assignToMe(id: number) {
    const response = await ApiService.patch(
      `trouble-ticket/${id}/assign-me`,
      {}
    );
    return response.data;
  }

  @catchApiError
  public static async completeTicketInBulk(payload) {
    const response = await ApiService.post(
      "trouble-ticket/bulk-update",
      payload
    );
    return response.data;
  }

  @catchApiError
  public static async leaveTicket(id: number, data) {
    const response = await ApiService.patch(
      `trouble-ticket/${id}/leave-ticket`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async sendBackTicket(id: number, data) {
    const response = await ApiService.patch(
      `trouble-ticket/${id}/sent-back`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async reOpenTicket(id: number, data) {
    const response = await ApiService.patch(
      `trouble-ticket/${id}/re-open`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async updateTicket(id: number, data) {
    const response = await ApiService.patch(`trouble-ticket/${id}`, data);
    return response.data;
  }

  @catchApiError
  public static async cancelTicket(id: number, data) {
    const response = await ApiService.patch(
      `trouble-ticket/${id}/cancel`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async rcaSubmitTicket(id: number, data) {
    const response = await ApiService.post(`trouble-ticket/${id}/rca`, data);
    return response.data;
  }

  @catchApiError
  public static async pauseRequestTicket(data) {
    const response = await ApiService.post(`pause-ticket`, data);
    return response.data;
  }

  @catchApiError
  public static async pauseRequestApproveTicket(id: number, data) {
    const response = await ApiService.patch(
      `pause-ticket/${id}/pause/approve`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async cancelPauseRequestTicket(id: number, data) {
    const response = await ApiService.patch(
      `pause-ticket/${id}/pause/cancel-pause-request`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async resumeTicket(id: number, data) {
    const response = await ApiService.patch(
      `pause-ticket/${id}/pause/resume`,
      data
    );
    return response.data;
  }

  @catchApiError
  public static async getTroubleTicketStatsCounts() {
    const res = await ApiService.get(
      "trouble-ticket-dashboard",
      "trouble-ticket-count"
    );
    return res.data.data;
  }

  @catchApiError
  public static async getTroubleTicketDashboard(query) {
    const queryParams = new URLSearchParams(query).toString();
    const res = await ApiService.get(
      "trouble-ticket-dashboard",
      `trend?${queryParams}`
    );
    return res.data.data;
  }

  @catchApiError
  public static async getTxDashboardStatsGraphsData(query) {
    const queryParams = new URLSearchParams(query).toString();
    const resp = await ApiService.get(
      "trouble-ticket-dashboard",
      `trend/transmission?${queryParams}`
    );
    return resp.data.data;
  }

  @catchApiError
  public static async getIpDashboardStatsGraphsData(query) {
    const queryParams = new URLSearchParams(query).toString();
    const resp = await ApiService.get(
      "trouble-ticket-dashboard",
      `trend/ip?${queryParams}`
    );
    return resp.data.data;
  }

  // @catchApiError
  // public static async getTroubleTicketStatsCounts(networkType, query) {
  //   const queryParams = new URLSearchParams(query).toString();
  //   let slug: string;
  //   if (networkType === AppConstants.NETWORK_TYPE.TRANSMISSION) {
  //     slug = `trouble-ticket-count/transmission`;
  //   } else {
  //     slug = `trouble-ticket-count/ip`;
  //   }
  //   const resp = await ApiService.get("trouble-ticket-dashboard", slug);
  //   return resp.data.data;
  // }

  public static getOpenTicketsStatusArray = () => {
    return Object.keys(TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS)
      .filter(
        (key) => key !== "COMPLETED" && key !== "CANCELLED" && key !== "PAUSE"
      )
      .map((key) => TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS[key]);
  };
}
