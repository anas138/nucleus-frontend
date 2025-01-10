enum nceGponMutations {
  SET_NCE_GPON_DATA_FROM_API = "setNceGponDataFromApi",
  SET_NCE_GPON_DATA_FROM_SOCKET = "setNceGponDataFromSocket",
  SET_NCE_GPON_FILTERS = "setNceGponFilters",
  SET_NCE_GPON_DASHBOARD_REFRESH_COUNT = "setNceGponDashboardRefreshKey",
}
enum nceGponActions {
  GET_ALL_NCE_GPON_ALARMS = "getAllNceGponAlarms",
}

export { nceGponMutations, nceGponActions };
