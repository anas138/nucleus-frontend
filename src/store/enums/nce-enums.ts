enum nceMutations {
  SET_NCE_DATA_FROM_API = "setNceDataFromApi",
  SET_NCE_DATA_FROM_SOCKET = "setNceDataFromSocket",
  SET_NCE_FILTERS = "setNceFilters",
  SET_NCE_DASHBOARD_REFRESH_COUNT = "setNceDashboardRefreshKey",
}
enum nceActions {
  GET_ALL_NCE_ALARMS = "getAllNceAlarms",
}

export { nceMutations, nceActions };
