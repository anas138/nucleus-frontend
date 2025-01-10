import { QueryParams } from "@/core/interface/interfaces";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import NceAlarmService from "@/core/services/NceAlarmService";
import { INceAlert } from "@/core/interface/nce-alarm-interface";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { prepareDataForServer } from "@/core/helpers/utils";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { INceGponAlert } from "@/core/interface/nce-gpon-alarm-interface";
import { nceGponActions, nceGponMutations } from "../enums/nce-gpon-enum";
import { nokiaTXNActions, nokiaTXNMutations } from "../enums/nokia-txn-enums";
import NokiaTXNAlarmService from "@/core/services/NokiaTXNAlarmService";
import { ElMessage } from "element-plus";
import { AppConstants } from "@/constants/app-constants";
import { ModuleName } from "../enums/module-enum";
import { AppNotificationsMutations } from "../enums/app-notifications-enum";

interface IData extends IAlarmListData {
  list: INceGponAlert[] | [];
}

@Module
export default class NokiaTXNModule extends VuexModule implements IData {
  total = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  list;
  filters = {};
  dashboardRefreshCountKey = 0;
  canPlaySound = true;
  isNokiaTxnAlarmsBgModeEnabled = true;
  alarmsCount = 0;

  @Action
  async [nokiaTXNActions.GET_ALL_NOKIA_TXN_ALARMS](queryParams?: QueryParams) {
    const response: IData = await NokiaTXNAlarmService.getAllAlarms({
      ...queryParams,
    });
    this.context.commit(
      nokiaTXNMutations.SET_NOKIA_TXN_DATA_FROM_API,
      response
    );
  }

  @Mutation
  [nokiaTXNMutations.SET_NOKIA_TXN_DATA_FROM_API](data: IData) {
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.hasNextPage = data.hasNextPage;
    this.hasPrevPage = data.hasPrevPage;
    this.list = data.list;
  }

  @Mutation
  [nokiaTXNMutations.SET_NOKIA_TXN_DATA_FROM_SOCKET](alert: INceGponAlert) {
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
  setNokiaTxnAlarmsCount() {
    this.alarmsCount++;
  }

  @Mutation
  clearNokiaTxnAlarmsCount() {
    this.alarmsCount = 0;
  }

  @Mutation
  disableNokiaTxnAlarmsBgMode() {
    this.isNokiaTxnAlarmsBgModeEnabled = false;
  }

  @Mutation
  enableNokiaTxnAlarmsBgMode() {
    this.isNokiaTxnAlarmsBgModeEnabled = true;
  }

  @Action
  handleWSNokiaTxnAlarmEvent(data) {
    if (!this.isNokiaTxnAlarmsBgModeEnabled) {
      const hasPrevPage = this.hasPrevPage;

      // add all conditions that you want to check in function below
      const shouldUpdateAlarms =
        !hasPrevPage &&
        NokiaTXNAlarmService.doesAlarmMatchesFilterConditions(data);

      if (shouldUpdateAlarms) {
        if (!data?.is_cleared) {
          ElMessage({
            message: `New ${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Alarm Received`,
            grouping: true,
            type: "success",
          });
        }
        this.context.commit(
          nokiaTXNMutations.SET_NOKIA_TXN_DATA_FROM_SOCKET,
          data
        );
      }
    } else if (
      data?.severity?.toLowerCase() ===
      AppConstants.ALARM_SEVERITIES.NOKIA_TXN.CRITICAL
    ) {
      this.context.commit("setNokiaTxnAlarmsCount");
      this.context.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS}`
      );
    }
  }

  @Mutation
  [nokiaTXNMutations.SET_NOKIA_TXN_FILTERS](filters) {
    filters = prepareDataForServer(filters);
    this.filters = filters;
  }

  @Mutation
  [nokiaTXNMutations.SET_NOKIA_TXN_DASHBOARD_REFRESH_COUNT]() {
    this.dashboardRefreshCountKey++;
  }

  @Mutation
  toggleCanPlayNokiaTXNSound() {
    this.canPlaySound = !this.canPlaySound;
  }

  get nokiaTXNAlarms() {
    return {
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      list: this.list || [],
    };
  }

  get nokiaTXNFilters() {
    return this.filters;
  }

  get getNokiaTXNDashboardRefreshKey() {
    return this.dashboardRefreshCountKey;
  }

  get getCanPlayNokiaTXNSound() {
    return this.canPlaySound;
  }

  get getNokiaTxnAlarmsCount() {
    return this.alarmsCount;
  }

  get getIsNokiaTxnAlarmsBgModeEnabled() {
    return this.isNokiaTxnAlarmsBgModeEnabled;
  }
}
