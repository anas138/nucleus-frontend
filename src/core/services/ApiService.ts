import { App } from "vue";
import axios, { AxiosError } from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import store from "@/store";
import router from "@/router";
import { ElNotification } from "element-plus";
import { ROUTES } from "@/constants/app-constants";
import { logOutMs } from "../helpers/utils";

class ApiService {
  public static vueInstance: App;
  public static axiosInstance: AxiosInstance;
  public static store;

  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.store = store;
    ApiService.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });

    ApiService.vueInstance.use(VueAxios, ApiService.axiosInstance);

    ApiService.setInterceptor();
  }

  public static setHeader(token?: string): void {
    ApiService.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token || JwtService.getToken()}`;
    ApiService.axiosInstance.defaults.headers.common["Accept"] =
      "application/json";
  }

  public static setInterceptor(): void {
    ApiService.axiosInstance.interceptors.request.use(
      (request: AxiosRequestConfig) => {
        request.headers.Authorization = `Bearer ${JwtService.getToken()}`;
        return request;
      }
    );
    ApiService.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // if token recieved
        if (response?.data?.data?.tokens?.access?.token)
          ApiService.setHeader(response?.data?.data?.tokens?.access?.token);
        return response;
      },
      (error: any) => {
        if (error.response && error.response.status === 401) {
          ApiService.handleUnauthorized(error);
        } else if (error.response && error.response.status === 403) {
          ApiService.handleForbidden(error);
        } else if (
          error.response.status === 400 ||
          error.response.status === 404 ||
          error.response.status === 409 ||
          error.response.status === 500
        ) {
          ElNotification({
            title: "Error",
            message: error.response.data.message,
            type: "error",
          });
        } else {
          ElNotification({
            title: "Error",
            message: error.response.data.message!,
            type: "error",
          });
        }
        return Promise.reject(error);
      }
    );
  }

  public static handleUnauthorized(error: AxiosError<any>): void {
    store.commit(Mutations.PURGE_AUTH);

    const currentRoute = router.currentRoute.value;

    if (currentRoute.name !== ROUTES.SIGNIN.NAME) {
      // Check if the "redirect" query parameter exists in the current route's query
      if (!currentRoute.query.redirect) {
        // "redirect" query parameter doesn't exist, so add it to the new route
        router
          .push({
            name: "sign-in",
            query: {
              ...currentRoute.query, // Copy the existing query parameters
              redirect: currentRoute.fullPath.toString(),
            },
          })
          .then(() => {
            logOutMs();
          });
      } else {
        router.push({ name: "sign-in" }).then(() => {
          logOutMs();
        });
      }
    }
  }

  public static handleForbidden(error): void {
    ElNotification({
      title: "Error",
      message: error.response.data.message,
      type: "error",
    });
    // router.push({ name: "dashboard" });
  }
  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static updateByPatch(
    resource: string,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static patch(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
