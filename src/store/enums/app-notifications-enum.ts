enum AppNotificationsMutations {
  SET_TROUBLE_TICKET_NOTIFICATIONS = "setTroubleTicketNotifications",
  CLEAR_DATA = "clearData",
  SET_ALL_SEEN = "setAllSeen",
  SET_TROUBLE_TICKET_NOTIFICATIONS_DATA_FROM_SOCKET = "setTroubleTicketNotificationsDataFromSocket",
  SET_ALARM_NOTIFICATION_COUNTS = "setAlarmNotificationCounts",
  CLEAR_ALARM_NOTIFICATION_COUNTS = "clearAlarmNotificationCounts",
  SUBTRACT_FROM_TOTAL_ALARMS_COUNTS = "subtractFromTotalAlarmsCounts",
}

enum AppNotificationsActions {
  GET_TROUBLE_TICKET_NOTIFICATIONS = "getTroubleTicketNotifications",
  MARK_ALL_SEEN = "markAllSeen",
  MARK_SEEN_BY_ID = "markSeenById",
}

export { AppNotificationsMutations, AppNotificationsActions };
