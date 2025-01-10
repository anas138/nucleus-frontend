import { QueryParams } from "@/core/interface/interfaces";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import {
  ldiSoftswitchEMSActions,
  ldiSoftswitchEMSMutations,
} from "../enums/ldi-softswitch-ems-enums";
import { INceAlert } from "@/core/interface/nce-alarm-interface";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { prepareDataForServer } from "@/core/helpers/utils";
import { AppConstants } from "@/constants/app-constants";
import { ElMessage } from "element-plus";
import { ModuleName } from "../enums/module-enum";
import { AppNotificationsMutations } from "../enums/app-notifications-enum";
import LDISoftswitchEMSAlarmService from "@/core/services/LDISoftswitchEMSAlarmService";
import { ILDISoftswitchEMSAlart } from "@/core/interface/ldi-softswitch-ems-alarm-interface";

interface IData extends IAlarmListData {
  list: ILDISoftswitchEMSAlart[] | [];
}

@Module
export default class LDISoftswitchEMSModule
  extends VuexModule
  implements IData
{
  total = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  list;
  filters = {};
  dashboardRefreshCountKey = 0;
  canPlaySound = true;
  isLDISoftswitchEMSAlarmsBgModeEnabled = true;
  alarmsCount = 0;

  @Action
  async [ldiSoftswitchEMSActions.GET_ALL_LDI_SOFTSWITCH_EMS_ALARMS](
    queryParams?: QueryParams
  ) {
    const response: IData = await LDISoftswitchEMSAlarmService.getAllAlarms({
      ...queryParams,
    });
    this.context.commit(
      ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DATA_FROM_API,
      response
    );
  }

  @Mutation
  [ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DATA_FROM_API](
    data: IData
  ) {
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.hasNextPage = data.hasNextPage;
    this.hasPrevPage = data.hasPrevPage;
    this.list = data.list;
  }

  @Mutation
  [ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DATA_FROM_SOCKET](
    alert: INceAlert
  ) {
    alert.style = {
      class: "font-weight-bold bg-secondary",
    };
    alert.onClick = function () {
      this.style.class = "";
    };
    const existingIndex = this.list.findIndex((item) => item.id === alert.id);

    if (existingIndex !== -1) {
      this.list[existingIndex] = alert;
    } else {
      this.list.unshift(alert);
    }
  }

  @Mutation
  setLDISoftswitchEMSAlarmsCount() {
    this.alarmsCount++;
  }

  @Mutation
  clearLDISoftswitchEMSAlarmsCount() {
    this.alarmsCount = 0;
  }

  @Mutation
  disableLDISoftswitchEMSAlarmsBgMode() {
    this.isLDISoftswitchEMSAlarmsBgModeEnabled = false;
  }

  @Mutation
  enableLDISoftswitchEMSAlarmsBgMode() {
    this.isLDISoftswitchEMSAlarmsBgModeEnabled = true;
  }

  @Action
  handleWSLDISoftswitchEMSAlarmEvent(data) {
    if (!this.isLDISoftswitchEMSAlarmsBgModeEnabled) {
      const hasPrevPage = this.hasPrevPage;

      // add all conditions that you want to check in function below
      const shouldUpdateAlarms =
        !hasPrevPage &&
        LDISoftswitchEMSAlarmService.doesAlarmMatchesFilterConditions(data);

      if (shouldUpdateAlarms) {
        if (!data?.is_cleared) {
          ElMessage({
            message: `New ${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Alarm Received`,
            grouping: true,
            type: "success",
          });
        }
        this.context.commit(
          ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DATA_FROM_SOCKET,
          data
        );
      }
    } else if (
      data?.severity?.toLowerCase() ===
      AppConstants.ALARM_SEVERITIES.LDI_SOFTSWITCH_EMS.MAJOR_ERROR
    ) {
      this.context.commit("setLDISoftswitchEMSAlarmsCount");
      this.context.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS}`
      );
    }
  }

  @Mutation
  [ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_FILTERS](filters) {
    filters = prepareDataForServer(filters);
    this.filters = filters;
  }

  @Mutation
  [ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DASHBOARD_REFRESH_COUNT]() {
    this.dashboardRefreshCountKey++;
  }

  @Mutation
  toggleCanPlayLDISoftswitchEMSSound() {
    this.canPlaySound = !this.canPlaySound;
  }

  get ldiSoftswitchEMSAlarms() {
    return {
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      list: this.list || [],
    };
  }

  get ldiSoftswitchEMSFilters() {
    return this.filters;
  }

  get getLDISoftswitchEMSDashboardRefreshKey() {
    return this.dashboardRefreshCountKey;
  }

  get getCanPlayLDISoftswitchEMSSound() {
    return this.canPlaySound;
  }

  get getLDISoftswitchEMSAlarmsCount() {
    return this.alarmsCount;
  }

  get getLDISoftswitchAlarmsEMSBgModeEnabled() {
    return this.isLDISoftswitchEMSAlarmsBgModeEnabled;
  }
}
