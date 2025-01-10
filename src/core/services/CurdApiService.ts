import ApiService from "@/core/services/ApiService";
import { proxyToObject, prepareDataForServer } from "@/core/helpers/utils";
import { AxiosResponse } from "axios";
import { catchApiError } from "../decorators/catchApiError";
import { QueryParams } from "../interface/interfaces";
import apiConfig from "@/constants/apiConfig";

export default class CurdApiService {
  // data, resource , id
  @catchApiError
  public static async createResource(data: object, resource: string) {
    const response = await ApiService.post(resource, proxyToObject(data));
    return response;
  }
  @catchApiError
  public static async getById(resource: string, id: string) {
    const response = await ApiService.get(resource, id);
    return response;
  }
  @catchApiError
  public static async getAll(resource: string, queryParms: QueryParams = {}) {
    queryParms = prepareDataForServer(queryParms);
    const response = ApiService.axiosInstance.get(resource, {
      params: {
        ...queryParms,
        limit: queryParms.limit || apiConfig.limitPerPage,
        page: queryParms.page || apiConfig.page,
      },
    });
    return response;
  }
  @catchApiError
  public static async deleteResource(resource: string, id: string | number) {
    const response = await ApiService.delete(`${resource}/${id}`);
    return response;
  }
  @catchApiError
  public static async editResource(formData, resource, id: string) {
    const response: AxiosResponse = await ApiService.put(
      `${resource}/${id}`,
      proxyToObject(formData)
    );
    return response;
  }
}
