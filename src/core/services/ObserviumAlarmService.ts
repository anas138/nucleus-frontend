import store from "@/store";
import {
  prepareDataForServer,
  proxyToObject,
  removeEmptyStringValuesFromObject,
} from "../helpers/utils";
import { QueryParams } from "../interface/interfaces";
import { IobserviumAlert } from "../interface/observium-alarm-interface";
import CurdApiService from "./CurdApiService";
import { inRange, upperFirst } from "lodash";
import { catchApiError } from "../decorators/catchApiError";
import ApiService from "./ApiService";

export default class ObserviumAlarmService {
  public static async getAllAlarms(queryParms: QueryParams = {}) {
    queryParms = prepareDataForServer(queryParms);
    const response = await CurdApiService.getAll("obs-alerts", queryParms);
    return response.data.data;
  }

  public static async getAlarmById(id: string) {
    const response = await CurdApiService.getById("obs-alerts", id);
    return response.data.data;
  }

  // matches condition
  public static doesAlarmMatchesFilterConditions(Alarm: IobserviumAlert) {
    const filters: QueryParams = removeEmptyStringValuesFromObject(
      proxyToObject(store.getters.observiumFilters)
    );

    // add all conditions here that you would like to match in the alarm
    // the key corresponds to filter's key while the value is matching condition

    const filtersConditionObj = {
      severity: filters?.severity?.includes(upperFirst(Alarm.alert_severity)),
      alarmName: filters?.alarmName?.includes(Alarm.alert_message),
      devices: filters?.devices?.includes(Alarm.device_id),
      alarmStatus:
        (filters?.alarmStatus === "cleared" && Alarm.is_cleared) ||
        (filters?.alarmStatus !== "cleared" && !Alarm.is_cleared),

      lastOccurredFrom: inRange(
        new Date(Alarm.updated_at).getTime(),
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
      "obs-alerts",
      `recipients?alarm_id=${id}`
    );

    return response.data.data;
  }
}
