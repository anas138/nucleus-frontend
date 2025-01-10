import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import {
  AppNotificationsActions,
  AppNotificationsMutations,
} from "../enums/app-notifications-enum";
import AppNotificationService from "@/core/services/AppNotificationService";
import { AppNotifications } from "@/core/interface/app-notifications-interfaces";
import { AppConstants } from "@/constants/app-constants";

@Module({
  namespaced: true,
})
export default class AppNotificationsModule extends VuexModule {
  notificationList = [] as AppNotifications[];
  unSeenCount = 0;
  unSeenAlarmNotificationCount = 0;
  alarmNotificationCount = 0;

  get getNotifications() {
    return this.notificationList;
  }

  get getUnSeenCount() {
    return Number(this.unSeenCount);
  }

  get getAlarmNotificationCount() {
    return this.alarmNotificationCount;
  }

  @Mutation
  [AppNotificationsMutations.CLEAR_DATA]() {
    this.notificationList = [];
    this.unSeenCount = 0;
  }

  @Mutation
  [AppNotificationsMutations.SET_TROUBLE_TICKET_NOTIFICATIONS]({
    notificationsList,
    unSeenCount,
  }: {
    notificationsList: AppNotifications[];
    unSeenCount: any;
  }) {
    this.notificationList = notificationsList;
    this.unSeenCount = unSeenCount?.count;
  }

  @Mutation
  [AppNotificationsMutations.SET_ALL_SEEN]() {
    this.unSeenCount = 0;
  }

  @Mutation
  [AppNotificationsMutations.SET_TROUBLE_TICKET_NOTIFICATIONS_DATA_FROM_SOCKET](
    data: AppNotifications
  ) {
    this.notificationList.unshift(data);
    this.unSeenCount++;
  }

  @Mutation
  [AppNotificationsMutations.SET_ALARM_NOTIFICATION_COUNTS]() {
    this.alarmNotificationCount++;
  }

  @Mutation
  [AppNotificationsMutations.CLEAR_ALARM_NOTIFICATION_COUNTS]() {
    this.alarmNotificationCount = 0;
  }

  @Mutation
  [AppNotificationsMutations.SUBTRACT_FROM_TOTAL_ALARMS_COUNTS](
    counts: number
  ) {
    this.alarmNotificationCount = this.alarmNotificationCount - counts;
  }

  @Action
  async [AppNotificationsActions.GET_TROUBLE_TICKET_NOTIFICATIONS]() {
    const [notificationsList, unSeenCount] = await Promise.all([
      AppNotificationService.getAppNotification(),
      AppNotificationService.getAppNotificationUnSeenCount(),
    ]);
    this.context.commit(
      AppNotificationsMutations.SET_TROUBLE_TICKET_NOTIFICATIONS,
      { notificationsList, unSeenCount }
    );
  }

  @Action
  async [AppNotificationsActions.MARK_ALL_SEEN]() {
    await AppNotificationService.markAllUnSeen();
    this.context.commit(AppNotificationsMutations.SET_ALL_SEEN);
  }

  @Action
  async [AppNotificationsActions.MARK_SEEN_BY_ID](id: number) {
    await AppNotificationService.markIsOpen(id, {
      is_open: true,
    });

    this.context.dispatch(
      AppNotificationsActions.GET_TROUBLE_TICKET_NOTIFICATIONS
    );
  }
}
