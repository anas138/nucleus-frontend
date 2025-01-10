enum ldiSoftswitchEMSMutations {
  SET_LDI_SOFTSWITCH_EMS_DATA_FROM_API = "setLDISoftswitchEMSDataFromApi",
  SET_LDI_SOFTSWITCH_EMS_DATA_FROM_SOCKET = "setLDISoftswitchEMSDataFromSocket",
  SET_LDI_SOFTSWITCH_EMS_FILTERS = "setLDISoftswitchEMSFilters",
  SET_LDI_SOFTSWITCH_EMS_DASHBOARD_REFRESH_COUNT = "setLDISoftswitchEMSDashboardRefreshKey",
}
enum ldiSoftswitchEMSActions {
  GET_ALL_LDI_SOFTSWITCH_EMS_ALARMS = "getAllLDISoftswitchEMSAlarms",
}

export { ldiSoftswitchEMSMutations, ldiSoftswitchEMSActions };
