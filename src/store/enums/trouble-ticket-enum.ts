enum troubleTicketMutations {
  SET_STEPPER_DATA = "setStepperData",
  SET_ALARM_DATA = "setAlarmData",
  SET_TROUBLE_TICKET = "setTroubleTicket",
  CLEAR_DATA = "clearData",
  SET_COMMENTS = "setComments",
  SET_ACTIVITY_LOG = "setActivityLog",
}

enum troubleTicketActions {
  GET_STEPPER_DATA = "getStepperData",
  GET_ALARM_DATA = "getAlarmData",
  GET_TROUBLE_TICKET = "getTroubleTicket",
  GET_COMMENTS = "getComments",
  GET_ACTIVITY_LOGS = "getActivityLogs",
}

export { troubleTicketMutations, troubleTicketActions };
