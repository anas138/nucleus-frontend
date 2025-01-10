enum nokiaTXNMutations {
  SET_NOKIA_TXN_DATA_FROM_API = "setNokiaTXNDataFromApi",
  SET_NOKIA_TXN_DATA_FROM_SOCKET = "setNokiaTXNDataFromSocket",
  SET_NOKIA_TXN_FILTERS = "setNokiaTXNFilters",
  SET_NOKIA_TXN_DASHBOARD_REFRESH_COUNT = "setNokiaTXNDashboardRefreshKey",
}
enum nokiaTXNActions {
  GET_ALL_NOKIA_TXN_ALARMS = "getAllNokiaTXNAlarms",
}

export { nokiaTXNMutations, nokiaTXNActions };
