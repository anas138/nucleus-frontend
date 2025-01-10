import { QueryParams } from "@/core/interface/interfaces";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import NceAlarmService from "@/core/services/NceAlarmService";
import { INceAlert } from "@/core/interface/nce-alarm-interface";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { prepareDataForServer } from "@/core/helpers/utils";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { INceGponAlert } from "@/core/interface/nce-gpon-alarm-interface";
import { nceGponActions, nceGponMutations } from "../enums/nce-gpon-enum";
import { ElMessage } from "element-plus";
import { AppConstants } from "@/constants/app-constants";
import { ModuleName } from "../enums/module-enum";
import { AppNotificationsMutations } from "../enums/app-notifications-enum";

interface IData extends IAlarmListData {
  list: INceGponAlert[] | [];
}

@Module
export default class NceGponModule extends VuexModule implements IData {
  total = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  list;
  filters = {};
  dashboardRefreshCountKey = 0;
  canPlaySound = true;
  isNceGponAlarmsBgModeEnabled = true;
  alarmsCount = 0;

  @Action
  async [nceGponActions.GET_ALL_NCE_GPON_ALARMS](queryParams?: QueryParams) {
    const response: IData = await NceGponAlarmService.getAllAlarms({
      ...queryParams,
    });
    this.context.commit(nceGponMutations.SET_NCE_GPON_DATA_FROM_API, response);
  }

  @Mutation
  [nceGponMutations.SET_NCE_GPON_DATA_FROM_API](data: IData) {
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.hasNextPage = data.hasNextPage;
    this.hasPrevPage = data.hasPrevPage;
    this.list = data.list;
  }

  @Mutation
  [nceGponMutations.SET_NCE_GPON_DATA_FROM_SOCKET](alert: INceGponAlert) {
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
  setNceGponAlarmsCount() {
    this.alarmsCount++;
  }

  @Mutation
  clearNceGponAlarmsCount() {
    this.alarmsCount = 0;
  }

  @Mutation
  disableNceGponAlarmsBgMode() {
    this.isNceGponAlarmsBgModeEnabled = false;
  }

  @Mutation
  enableNceGponAlarmsBgMode() {
    this.isNceGponAlarmsBgModeEnabled = true;
  }

  @Action
  handleWSNceGponAlarmEvent(data) {
    if (!this.isNceGponAlarmsBgModeEnabled) {
      const hasPrevPage = this.hasPrevPage;

      // add all conditions that you want to check in function below
      const shouldUpdateAlarms =
        !hasPrevPage &&
        NceGponAlarmService.doesAlarmMatchesFilterConditions(data);

      if (shouldUpdateAlarms) {
        if (!data?.is_cleared) {
          ElMessage({
            message: `New ${AppConstants.NCE_GPON_PRESENTATION_NAME} Alarm Received`,
            grouping: true,
            type: "success",
          });
        }
        this.context.commit(
          nceGponMutations.SET_NCE_GPON_DATA_FROM_SOCKET,
          data
        );
      }
    } else if (
      data?.severity?.toLowerCase() ===
      AppConstants.ALARM_SEVERITIES.NCE_GPON.CRITICAL
    ) {
      this.context.commit("setNceGponAlarmsCount");
      this.context.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS}`
      );
    }
  }

  @Mutation
  [nceGponMutations.SET_NCE_GPON_FILTERS](filters) {
    filters = prepareDataForServer(filters);
    this.filters = filters;
  }

  @Mutation
  [nceGponMutations.SET_NCE_GPON_DASHBOARD_REFRESH_COUNT]() {
    this.dashboardRefreshCountKey++;
  }

  @Mutation
  toggleCanPlayNceGponSound() {
    this.canPlaySound = !this.canPlaySound;
  }

  get nceGponAlarms() {
    return {
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      list: this.list || [],
    };
  }

  get nceGponFilters() {
    return this.filters;
  }

  get getNceGponDashboardRefreshKey() {
    return this.dashboardRefreshCountKey;
  }

  get getCanPlayNceGponSound() {
    return this.canPlaySound;
  }

  get getNceGponAlarmsCount() {
    return this.alarmsCount;
  }

  get getIsNceGponAlarmsBgModeEnabled() {
    return this.isNceGponAlarmsBgModeEnabled;
  }
}
