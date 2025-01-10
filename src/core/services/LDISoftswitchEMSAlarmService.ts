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
import { ILDISoftswitchEMSAlart } from "../interface/ldi-softswitch-ems-alarm-interface";

export default class LDISoftswitchEMSAlarmService {
  public static async getAllAlarms(queryParms: QueryParams = {}) {
    queryParms = prepareDataForServer(queryParms);
    const response = await CurdApiService.getAll(
      "ldi-softswitch-alarms",
      queryParms
    );
    return response.data.data;
  }

  public static async getAlarmById(id: string) {
    const response = await CurdApiService.getById("ldi-softswitch-alarms", id);
    return response.data.data;
  }

  // matches condition
  public static doesAlarmMatchesFilterConditions(
    Alarm: ILDISoftswitchEMSAlart
  ) {
    const filters: QueryParams = removeEmptyStringValuesFromObject(
      proxyToObject(store.getters.ldiSoftswitchEMSFilters)
    );

    // add all conditions here that you would like to match in the alarm
    // the key corresponds to filter while the value is matching condition

    const filtersConditionObj = {
      severity: filters?.severity?.includes(upperFirst(Alarm.severity)),
      alarmFilterConfigId: filters?.alarmFilterConfigId?.includes(
        Alarm.alarm_filter_config_id
      ),
      trunkGroup: filters?.trunkGroup?.includes(Alarm.trunk_group),
      alarmType: filters?.alarmType === Alarm.alarm_type,
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
      "ldi-softswitch-alarms",
      `recipients?alarm_id=${id}`
    );

    return response.data.data;
  }
}
