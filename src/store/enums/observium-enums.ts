enum observiumMutations {
  SET_OBSERVIUM_DATA_FROM_API = "setObserviumDataFromApi",
  SET_OBSERVIUM_DATA_FROM_SOCKET = "setObserviumDataFromSocket",
  SET_OBSERVIUM_FILTERS = "setObserviumFilters",
  SET_OBSERVIUM_DASHBOARD_REFRESH_COUNT = "setObsDashboardRefreshKey",
}
enum observiumActions {
  GET_ALL_OBSERVIUM_ALARMS = "getAllObserviumAlarms",
}

export { observiumMutations, observiumActions };
