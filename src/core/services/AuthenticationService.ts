import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";

export default class AuthenticationService {
  @catchApiError
  public static async forgotPassword(data) {
    const response = await ApiService.post("/auth/forgot-password", data);
    return response;
  }

  @catchApiError
  public static async updatePassword(payload) {
    const response = await ApiService.post("/auth/update-password", payload);
    return response;
  }
}
