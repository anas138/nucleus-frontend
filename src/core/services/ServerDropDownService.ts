import { catchApiError } from "../decorators/catchApiError";
import { makeListForDropDowm } from "../helpers/utils";
import { basicDropDownListValue } from "../interface/interfaces";
import ApiService from "./ApiService";
import lodash, * as _ from "lodash";

export default class ServerDropDownService {
  @catchApiError
  public static async getDropDownFromSever(constant: string) {
    const response = await ApiService.axiosInstance.get(
      `drop-down-items?category_constant=${constant}`
    );
    const res = _.orderBy(response.data.data, ["sequence"], ["asc"]);
    return res;
  }
  @catchApiError
  public static async getAllUsersForDropDown(constant: string) {
    const response = await ApiService.axiosInstance.get(
      `users/user-type/${constant}`
    );
    const transformedData: basicDropDownListValue[] = lodash.map(
      response.data.data,
      (item) => ({
        key: item.id,
        label: `${item.full_name} - ${item.email}`,
      })
    );
    return transformedData;
  }
  @catchApiError
  public static async getAllSubDepartmentForDropDown() {
    const response = await ApiService.axiosInstance.get(`subdepartment`);
    const transformedData: basicDropDownListValue[] = makeListForDropDowm(
      response.data.data
    );
    return transformedData;
  }

  @catchApiError
  public static async getUsersBySubDepartmentForDropDown(id: number) {
    const response = await ApiService.axiosInstance.get(
      `subdepartment/${id}/users`
    );
    const transformedData = response.data.data?.users?.map((val) => {
      return { key: val.id, label: val.username };
    });
    return transformedData;
  }

  @catchApiError
  public static async getAllSubDepartmentsOfDepartmentForDropDown(id: number) {
    const response = await ApiService.axiosInstance.get(`department/${id}`);
    const transformedDataForSubDepartments: basicDropDownListValue[] =
      makeListForDropDowm(response.data.data.sub_departments);
    return transformedDataForSubDepartments;
  }

  @catchApiError
  public static async getAllSubDepartmentsOfEngineeringForDropDown() {
    const response = await ApiService.axiosInstance.get(
      `department/sub/Engineering`
    );
    return response.data.data;
  }

  @catchApiError
  public static async getAllDepartmentForDropDown() {
    const response = await ApiService.axiosInstance.get(`department`);
    const transformedDataDepartments: basicDropDownListValue[] =
      makeListForDropDowm(response.data.data);
    return transformedDataDepartments;
  }

  @catchApiError
  public static async getAllSubCategoriesForDropDown(id: number) {
    const response = await ApiService.axiosInstance.get(`tt-category/${id}`);
    const transformedDataForSubDepartments: basicDropDownListValue[] =
      makeListForDropDowm(response.data.data.sub_category);
    return transformedDataForSubDepartments;
  }

  @catchApiError
  public static async getAllCategoriesForDropDown() {
    const response = await ApiService.axiosInstance.get(`tt-category`);
    const transformedDataDepartments: basicDropDownListValue[] =
      makeListForDropDowm(response.data.data);
    return transformedDataDepartments;
  }
}
