import { AppConstants } from "@/constants/app-constants";
import moment from "moment";
import { PermissionsService } from "../services/PermissionsService";

export function initGlobaFunctions(app) {
  app.config.globalProperties.$filters = {
    removeUnderscore(value: string): string {
      return value.replace(/_/g, " ");
    },
  };
  app.config.globalProperties.$format = {
    dateFormat(date: string) {
      return new Date(date).toLocaleDateString("en-GB");
    },
    datetimeFormat(date: string) {
      const dateString = moment(date).format(
        AppConstants.DATE_FORMATS.DATETIME
      );
      return dateString !== "Invalid date" ? dateString : "-";
    },
  };
  app.config.globalProperties.$hasPermission = (permission) => {
    return PermissionsService.hasPermission(permission);
  };
  app.config.globalProperties.$troubleTicketPermission = (
    troubleTicket,
    userInfo
  ) => {
    return PermissionsService.troubleTicketPermission(troubleTicket, userInfo);
  };
  app.config.globalProperties.$dataTableSettings =
    AppConstants.DATATABLE_SETTINGS;
  app.config.globalProperties.$ncePresentationName =
    AppConstants.NCE_PRESENTATION_NAME;
  app.config.globalProperties.$observiumPresentationName =
    AppConstants.OBSERVIUM_PRESENTATION_NAME;
  app.config.globalProperties.$nceGponPresentationName =
    AppConstants.NCE_GPON_PRESENTATION_NAME;
  app.config.globalProperties.$nokiaTXNPresentationName =
    AppConstants.NOKIA_TXN_PRESENTATION_NAME;
  app.config.globalProperties.$LDISoftswitchEMSPresentationName =
    AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME;
  app.config.globalProperties.$filterTemplateTypes =
    AppConstants.FILTER_TEMPLATE_TYPES;
  app.config.globalProperties.$emptyDataImageUrl =
    AppConstants.EMPTY_DATA_IMAGE_URL;
}
