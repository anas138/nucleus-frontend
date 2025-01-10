import { QueryParams } from "@/core/interface/interfaces";
import ObserviumAlarmService from "@/core/services/ObserviumAlarmService";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import { observiumActions, observiumMutations } from "../enums/observium-enums";
import { prepareDataForServer } from "@/core/helpers/utils";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { IobserviumAlert } from "@/core/interface/observium-alarm-interface";
import { AppConstants } from "@/constants/app-constants";
import { ElMessage } from "element-plus";
import { ModuleName } from "../enums/module-enum";
import { AppNotificationsMutations } from "../enums/app-notifications-enum";

interface IData extends IAlarmListData {
  list: IobserviumAlert[] | [];
}

@Module
export default class ObserviumModule extends VuexModule implements IData {
  total = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;
  list;
  filters = {};
  dashboardRefreshCountKey = 0;
  canPlaySound = true;
  alarmsCount = 0;
  isObserviumAlarmsBgModeEnabled = true;

  @Action
  async [observiumActions.GET_ALL_OBSERVIUM_ALARMS](queryParams?: QueryParams) {
    const response: IData = await ObserviumAlarmService.getAllAlarms({
      ...queryParams,
    });
    this.context.commit(
      observiumMutations.SET_OBSERVIUM_DATA_FROM_API,
      response
    );
  }

  @Mutation
  [observiumMutations.SET_OBSERVIUM_DATA_FROM_API](data: IData) {
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.hasNextPage = data.hasNextPage;
    this.hasPrevPage = data.hasPrevPage;
    this.list = data.list;
  }

  @Mutation
  [observiumMutations.SET_OBSERVIUM_DATA_FROM_SOCKET](alert: IobserviumAlert) {
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
  setObserviumAlarmsCount() {
    this.alarmsCount++;
  }

  @Mutation
  clearObserviumAlarmsCount() {
    this.alarmsCount = 0;
  }

  @Mutation
  disableObserviumAlarmsBgMode() {
    this.isObserviumAlarmsBgModeEnabled = false;
  }

  @Mutation
  enableObserviumAlarmsBgMode() {
    this.isObserviumAlarmsBgModeEnabled = true;
  }

  @Action
  handleWSObserviumAlarmEvent(data) {
    if (!this.isObserviumAlarmsBgModeEnabled) {
      const hasPrevPage = this.hasPrevPage;

      const shouldUpdateAlarms =
        !hasPrevPage &&
        ObserviumAlarmService.doesAlarmMatchesFilterConditions(data);

      if (shouldUpdateAlarms) {
        if (!data?.is_cleared) {
          ElMessage({
            message: "New IP Alarm Received",
            grouping: true,
            type: "success",
          });
        }
        this.context.commit(
          observiumMutations.SET_OBSERVIUM_DATA_FROM_SOCKET,
          data
        );
      }
    } else if (
      data?.alert_severity?.toLowerCase() ===
      AppConstants.ALARM_SEVERITIES.OBSERVIUM.CRITICAL
    ) {
      this.context.commit("setObserviumAlarmsCount");
      this.context.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS}`
      );
    }
  }

  @Mutation
  [observiumMutations.SET_OBSERVIUM_FILTERS](filters) {
    filters = prepareDataForServer(filters);
    console.log("filters", filters);
    this.filters = filters;
  }

  @Mutation
  [observiumMutations.SET_OBSERVIUM_DASHBOARD_REFRESH_COUNT]() {
    this.dashboardRefreshCountKey++;
  }

  @Mutation
  toggleCanPlayObserviumSound() {
    this.canPlaySound = !this.canPlaySound;
  }

  get observiumAlarm() {
    return {
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      list: this.list || [],
    };
  }

  get observiumFilters() {
    return this.filters;
  }

  get getObsDashboardRefreshKey() {
    return this.dashboardRefreshCountKey;
  }

  get getCanPlayObserviumSound() {
    return this.canPlaySound;
  }

  get getObserviumAlarmsCount() {
    return this.alarmsCount;
  }

  get getIsObserviumAlarmsBgModeEnabled() {
    return this.isObserviumAlarmsBgModeEnabled;
  }
}
