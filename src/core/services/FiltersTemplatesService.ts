import { catchApiError } from "../decorators/catchApiError";
import CurdApiService from "./CurdApiService";
import {
  IFiltersTemplateCreate,
  TemplateType,
} from "../interface/filter-template-interfaces";
import { AxiosResponse } from "axios";
import { ElNotification } from "element-plus";
import { IApiResponse } from "../interface/api-response";

export default class FiltersTemplateService {
  private static resourse = "filters-template";

  @catchApiError
  public static async createFilterTemplate(payload: IFiltersTemplateCreate) {
    const response: AxiosResponse<IApiResponse> =
      await CurdApiService.createResource(payload, this.resourse);
    ElNotification({ message: response.data.message, type: "success" });
    return response;
  }

  @catchApiError
  public static async deleteFilterTemplate(id: number) {
    const response: AxiosResponse<IApiResponse> =
      await CurdApiService.deleteResource(this.resourse, id);
    ElNotification({ message: response.data.message, type: "info" });
    return response;
  }

  @catchApiError
  public static async getFilterTemplateById(id: number) {
    const response: AxiosResponse<IApiResponse> = await CurdApiService.getById(
      this.resourse,
      String(id)
    );
    return response.data.data;
  }

  @catchApiError
  public static async getAllFilterTemplate(template_type: TemplateType) {
    const response: AxiosResponse<IApiResponse> = await CurdApiService.getAll(
      this.resourse,
      { template_type }
    );
    return response.data.data;
  }
}
