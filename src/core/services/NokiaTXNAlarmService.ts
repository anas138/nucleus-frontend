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
import { INokiaTXNAlart } from "../interface/nokia-txn-alarm-interface";

export default class NokiaTXNAlarmService {
  public static async getAllAlarms(queryParms: QueryParams = {}) {
    queryParms = prepareDataForServer(queryParms);
    const response = await CurdApiService.getAll(
      "nokia-txn-alarms",
      queryParms
    );
    return response.data.data;
  }

  public static async getAlarmById(id: string) {
    const response = await CurdApiService.getById("nokia-txn-alarms", id);
    return response.data.data;
  }

  // matches condition
  public static doesAlarmMatchesFilterConditions(Alarm: INokiaTXNAlart) {
    const filters: QueryParams = removeEmptyStringValuesFromObject(
      proxyToObject(store.getters.nokiaTXNFilters)
    );

    // add all conditions here that you would like to match in the alarm
    // the key corresponds to filter while the value is matching condition

    const filtersConditionObj = {
      severity: filters?.severity?.includes(upperFirst(Alarm.severity)),
      alarmName: filters?.alarmName?.includes(Alarm.alarm_name),
      devices: filters?.devices?.includes(Alarm.ne_nokia_id),
      alarmStatus:
        (filters?.alarmStatus === "cleared" && Alarm.is_cleared) ||
        (filters?.alarmStatus !== "cleared" && !Alarm.is_cleared),

      lastOccurredFrom: inRange(
        new Date(Alarm.last_time_detected).getTime(),
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
      "nokia-txn-alarms",
      `recipients?alarm_id=${id}`
    );

    return response.data.data;
  }
}
