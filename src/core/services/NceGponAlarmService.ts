import store from "@/store";
import { QueryParams } from "../interface/interfaces";
import CurdApiService from "./CurdApiService";
import { inRange, upperFirst } from "lodash";
import { INceAlert } from "../interface/nce-alarm-interface";
import {
  prepareDataForServer,
  proxyToObject,
  removeEmptyStringValuesFromObject,
} from "../helpers/utils";
import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";
import { INceGponAlert } from "../interface/nce-gpon-alarm-interface";

export default class NceGponAlarmService {
  public static async getAllAlarms(queryParms: QueryParams = {}) {
    queryParms = prepareDataForServer(queryParms);
    const response = await CurdApiService.getAll("nce-gpon-alarms", queryParms);
    return response.data.data;
  }

  public static async getAlarmById(id: string) {
    const response = await CurdApiService.getById("nce-gpon-alarms", id);
    return response.data.data;
  }

  // matches condition
  public static doesAlarmMatchesFilterConditions(Alarm: INceGponAlert) {
    const filters: QueryParams = removeEmptyStringValuesFromObject(
      proxyToObject(store.getters.nceGponFilters)
    );

    // add all conditions here that you would like to match in the alarm
    // the key corresponds to filter while the value is matching condition

    const filtersConditionObj = {
      severity: filters?.severity?.includes(upperFirst(Alarm.severity)),
      alarmName: filters?.alarmName?.includes(Alarm.native_probable_cause),
      devices: filters?.devices?.includes(Alarm.ne_resource_id),
      alarmStatus:
        (filters?.alarmStatus === "cleared" && Alarm.is_cleared) ||
        (filters?.alarmStatus !== "cleared" && !Alarm.is_cleared),

      lastOccurredFrom: inRange(
        new Date(Alarm.last_changed_on).getTime(),
        new Date(filters?.lastOccurredFrom).getTime(),
        new Date(filters?.lastOccurredTo).getTime()
      ),
      lastOccurredTo: function () {
        return this.lastOccurredFrom;
      },
    };

    let prevResponse = true;
    for (const filter of Object.keys(filters)) {
      if (!filtersConditionObj[filter]) {
        prevResponse = false;
        break;
      }
    }

    return prevResponse;
  }

  @catchApiError
  public static async getAlarmEmailRecipientsFromId(id: number) {
    const response = await ApiService.get(
      "nce-gpon-alarms",
      `recipients?alarm_id=${id}`
    );

    return response.data.data;
  }
}
