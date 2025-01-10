import { ModuleName } from "./module-enum";

enum Actions {
  // action types
  ADD_BODY_CLASSNAME = "addBodyClassName",
  REMOVE_BODY_CLASSNAME = "removeBodyClassName",
  ADD_BODY_ATTRIBUTE = "addBodyAttribute",
  REMOVE_BODY_ATTRIBUTE = "removeBodyAttribute",
  ADD_CLASSNAME = "addClassName",
  VERIFY_AUTH = "verifyAuth",
  LOGIN = "login",
  LOGIN_WITH_MS = "loginWithMS",
  LOGOUT = "logout",
  REGISTER = "register",
  UPDATE_USER = "updateUser",
  FORGOT_PASSWORD = "forgotPassword",
  SET_BREADCRUMB_ACTION = "setBreadcrumbAction",
  SET_THEME_MODE_ACTION = "setThemeModeAction",
  GET_MY_INFO = "getMyInfo",
  GET_ALL_PERMISSIONS = "getAllPermissions",
}

enum Mutations {
  // mutation types
  SET_CLASSNAME_BY_POSITION = "appendBreadcrumb",
  PURGE_AUTH = "logOut",
  SET_AUTH = "setAuth",
  SET_USER = "setUser",
  SET_PASSWORD = "setPassword",
  SET_ERROR = "setError",
  SET_DEFAULT_DASHBOARD = "setDefaultDashboard",
  SET_BREADCRUMB_MUTATION = "setBreadcrumbMutation",
  SET_LAYOUT_CONFIG_PROPERTY = "setLayoutConfigProperty",
  RESET_LAYOUT_CONFIG = "resetLayoutConfig",
  OVERRIDE_LAYOUT_CONFIG = "overrideLayoutConfig",
  OVERRIDE_PAGE_LAYOUT_CONFIG = "overridePageLayoutConfig",
  SET_THEME_MODE_MUTATION = "setThemeModeMutation",
  SET_APP_VERSION = "setAppVersion",
  SET_APP_VERSION_DB = "setAppVersionDB",
  SET_USER_PERMISSIONS = "setUserPermissions",
  SET_SIDEBAR_MINIMIZE = "setSidebarMinimize",
}

enum FiltersTemplatesMutations {
  SET_FILTER_TEMPLATES = "setFiltersTemplates",
  SELECTED_TEMPLATE_ID = "selecttemplateid",
  CLEAR_FILTER_TEMPLATES = "clearfiltertemplates",
  CLEAR_FILTERS = "clearFilters",
}

const FiltersTemplateActions = {
  DELETE_FILTERS_TEMPLATE: "deleteFilterTemplate",
  SAVE_FILTERS_TEMPLATE: "saveFilterTemplate",
  Get_ALL_FILTERS_TEMPLATE: "getAllFiltersTemplate",
  getNameSpacedAction: (action: string) => {
    return `${ModuleName.filtersTemplate}/${action}`;
  },
};

export {
  Actions,
  Mutations,
  FiltersTemplatesMutations,
  FiltersTemplateActions,
};
