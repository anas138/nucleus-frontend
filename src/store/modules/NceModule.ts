import { QueryParams } from "@/core/interface/interfaces";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import NceAlarmService from "@/core/services/NceAlarmService";
import { nceActions, nceMutations } from "../enums/nce-enums";
import { INceAlert } from "@/core/interface/nce-alarm-interface";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { prepareDataForServer } from "@/core/helpers/utils";
import { AppConstants } from "@/constants/app-constants";
import { ElMessage } from "element-plus";
import { ModuleName } from "../enums/module-enum";
import { AppNotificationsMutations } from "../enums/app-notifications-enum";

interface IData extends IAlarmListData {
  list: INceAlert[] | [];
}

@Module
export default class NceModule extends VuexModule implements IData {
  total = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  list;
  filters = {};
  dashboardRefreshCountKey = 0;
  canPlaySound = true;
  isNCEAlarmsBgModeEnabled = true;
  alarmsCount = 0;

  @Action
  async [nceActions.GET_ALL_NCE_ALARMS](queryParams?: QueryParams) {
    const response: IData = await NceAlarmService.getAllAlarms({
      ...queryParams,
    });
    this.context.commit(nceMutations.SET_NCE_DATA_FROM_API, response);
  }

  @Mutation
  [nceMutations.SET_NCE_DATA_FROM_API](data: IData) {
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.hasNextPage = data.hasNextPage;
    this.hasPrevPage = data.hasPrevPage;
    this.list = data.list;
  }

  @Mutation
  [nceMutations.SET_NCE_DATA_FROM_SOCKET](alert: INceAlert) {
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
  setNceTxnAlarmsCount() {
    this.alarmsCount++;
  }

  @Mutation
  clearNceTxnAlarmsCount() {
    this.alarmsCount = 0;
  }

  @Mutation
  disableNCEAlarmsBgMode() {
    this.isNCEAlarmsBgModeEnabled = false;
  }

  @Mutation
  enableNCEAlarmsBgMode() {
    this.isNCEAlarmsBgModeEnabled = true;
  }

  @Action
  handleWSNceTxnAlarmEvent(data) {
    if (!this.isNCEAlarmsBgModeEnabled) {
      const hasPrevPage = this.hasPrevPage;

      // add all conditions that you want to check in function below
      const shouldUpdateAlarms =
        !hasPrevPage && NceAlarmService.doesAlarmMatchesFilterConditions(data);

      if (shouldUpdateAlarms) {
        if (!data?.is_cleared) {
          ElMessage({
            message: `New ${AppConstants.NCE_PRESENTATION_NAME} Alarm Received`,
            grouping: true,
            type: "success",
          });
        }
        this.context.commit(nceMutations.SET_NCE_DATA_FROM_SOCKET, data);
      }
    } else if (
      data?.severity?.toLowerCase() ===
      AppConstants.ALARM_SEVERITIES.NCE.CRITICAL
    ) {
      this.context.commit("setNceTxnAlarmsCount");
      this.context.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS}`
      );
    }
  }

  @Mutation
  [nceMutations.SET_NCE_FILTERS](filters) {
    filters = prepareDataForServer(filters);
    this.filters = filters;
  }

  @Mutation
  [nceMutations.SET_NCE_DASHBOARD_REFRESH_COUNT]() {
    this.dashboardRefreshCountKey++;
  }

  @Mutation
  toggleCanPlayNceSound() {
    this.canPlaySound = !this.canPlaySound;
  }

  get nceAlarms() {
    return {
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      list: this.list || [],
    };
  }

  get nceFilters() {
    return this.filters;
  }

  get getNceDashboardRefreshKey() {
    return this.dashboardRefreshCountKey;
  }

  get getCanPlayNceSound() {
    return this.canPlaySound;
  }

  get getNceTxnAlarmsCount() {
    return this.alarmsCount;
  }

  get getIsNCEAlarmsBgModeEnabled() {
    return this.isNCEAlarmsBgModeEnabled;
  }
}
