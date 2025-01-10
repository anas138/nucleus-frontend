import { AxiosResponse } from "axios";
import { QueryParams, basicDropDownListValue } from "../interface/interfaces";
import { IPermission } from "../interface/permission-interface";
import lodash, * as _ from "lodash";
import { ElNotification } from "element-plus";
import router from "@/router";
import { AlarmsAppTypeModel, AlarmsModel } from "../model/alarms-model";
import {
  ALARM_CONFIG,
  AppConstants,
  TroubleTicketContants,
} from "@/constants/app-constants";
import moment from "moment";
import msalAuthService from "../services/msalAuthService";
import { themeMode } from "./config";
import { ToggleComponent } from "@/assets/ts/components";
import { Mutations } from "@/store/enums/StoreEnums";
import store from "@/store";
import NceAlarmDetailSide from "@/components/nce-components/NceAlarmDetailSide.vue";
import ObserviumAlarmDetailSide from "@/components/observium-components/ObserviumAlarmDetailSide.vue";
import NceGponAlarmDetailSide from "@/components/nce-gpon-components/NceGponAlarmDetailSide.vue";
import NokiaTXNAlarmDetailSide from "@/components/nokia-txn-components/NokiaTXNAlarmDetailSide.vue";
import LDISoftswitchEMSAlarmDetailSide from "@/components/ldi-softswitch-ems-components/LDISoftswitchEMSAlarmDetailSide.vue";

// this make a url for image by concating the url with server address
// if null or empty string is passed it will send
// a blank image from assets
export const imageUrl = (url: string): string => {
  const baseURL = process.env.VUE_APP_API_URL;
  if (typeof baseURL === "string" && url) {
    const fullURL = new URL(url, baseURL);
    return fullURL.toString();
  }
  return "/media/avatars/blank.png";
};

export const logOutMs = () => {
  const isMsLoggedIn = msalAuthService.isUserLoggedIn();
  if (isMsLoggedIn) {
    msalAuthService.signOut(() => {
      //useCallback
    });
  }
};

export function proxyToObject(proxyObject) {
  return JSON.parse(JSON.stringify(proxyObject));
}

export function objectToQueryString(params: QueryParams = {}): string {
  delete params["limit"];
  delete params["page"];
  const urlSearchParams = new URLSearchParams();

  for (const key in params) {
    if (params[key]) {
      urlSearchParams.append(key, params[key].toString());
    }
  }

  return urlSearchParams.toString();
}

export function NceAlarmSeverityBadge(type: string): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";

  switch (type?.toLowerCase()) {
    case AppConstants.ALARM_SEVERITIES.NCE.MAJOR:
      badgeText = "Major";
      badgeIcon = "bi-exclamation-triangle-fill";
      iconColor = "text-warning";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE.CRITICAL:
      badgeText = "Critical";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE.MINOR:
      badgeText = "Minor";
      badgeIcon = "bi-exclamation-diamond-fill";
      iconColor = "text-success";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE.WARNING:
      badgeText = "Warning";
      badgeIcon = "bi-exclamation-square-fill";
      iconColor = "text-info";
      break;
    default:
      badgeText = type;
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}

export function ObserviumAlarmSeverityBadge(type: string): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";

  switch (type?.toLowerCase()) {
    case AppConstants.ALARM_SEVERITIES.OBSERVIUM.CRITICAL:
      badgeText = "Critical";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.OBSERVIUM.WARNING:
      badgeText = "Warning";
      badgeIcon = "bi-exclamation-square-fill";
      iconColor = "text-info";
      break;
    case AppConstants.ALARM_SEVERITIES.OBSERVIUM.NOTIFICATION:
      badgeText = "Notification";
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
    default:
      badgeText = type;
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}

export function NceGponAlarmSeverityBadge(type: string): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";

  switch (type?.toLowerCase()) {
    case AppConstants.ALARM_SEVERITIES.NCE_GPON.MAJOR:
      badgeText = "Major";
      badgeIcon = "bi-exclamation-triangle-fill";
      iconColor = "text-warning";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE_GPON.CRITICAL:
      badgeText = "Critical";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE_GPON.MINOR:
      badgeText = "Minor";
      badgeIcon = "bi-exclamation-diamond-fill";
      iconColor = "text-success";
      break;
    case AppConstants.ALARM_SEVERITIES.NCE_GPON.WARNING:
      badgeText = "Warning";
      badgeIcon = "bi-exclamation-square-fill";
      iconColor = "text-info";
      break;
    default:
      badgeText = type;
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}

export function NokiaTXNAlarmSeverityBadge(type: string): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";

  switch (type?.toLowerCase()) {
    case AppConstants.ALARM_SEVERITIES.NOKIA_TXN.MAJOR:
      badgeText = "Major";
      badgeIcon = "bi-exclamation-triangle-fill";
      iconColor = "text-warning";
      break;
    case AppConstants.ALARM_SEVERITIES.NOKIA_TXN.CRITICAL:
      badgeText = "Critical";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.NOKIA_TXN.MINOR:
      badgeText = "Minor";
      badgeIcon = "bi-exclamation-diamond-fill";
      iconColor = "text-success";
      break;
    case AppConstants.ALARM_SEVERITIES.NOKIA_TXN.WARNING:
      badgeText = "Warning";
      badgeIcon = "bi-exclamation-square-fill";
      iconColor = "text-info";
      break;
    default:
      badgeText = type;
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}

export function LDISoftswitchEMSAlarmSeverityBadge(type: string): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";

  switch (type?.toLowerCase()) {
    case AppConstants.ALARM_SEVERITIES.LDI_SOFTSWITCH_EMS.MAJOR_ERROR:
      badgeText = "Major Error";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.LDI_SOFTSWITCH_EMS.CRITICAL_ERROR:
      badgeText = "Critical Error";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case AppConstants.ALARM_SEVERITIES.LDI_SOFTSWITCH_EMS.MINOR_ERROR:
      badgeText = "Minor Error";
      badgeIcon = "bi-exclamation-diamond-fill";
      iconColor = "text-success";
      break;
    case AppConstants.ALARM_SEVERITIES.LDI_SOFTSWITCH_EMS.WARNING:
      badgeText = "Warning";
      badgeIcon = "bi-exclamation-square-fill";
      iconColor = "text-info";
      break;
    default:
      badgeText = type;
      badgeIcon = "bi-info-circle-fill";
      iconColor = "text-secondary";
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}

export function TroubleTicketPriorityBadge(id: number): string {
  let badgeText = "";
  let badgeIcon = "";
  let iconColor = "";
  switch (id) {
    case TroubleTicketContants.PRIORITY.P1:
      badgeText = "P1 (Critical)";
      badgeIcon = "bi-exclamation-octagon-fill";
      iconColor = "text-danger";
      break;
    case TroubleTicketContants.PRIORITY.P2:
      badgeText = "P2 (Medium)";
      badgeIcon = "bi-exclamation-triangle-fill";
      iconColor = "text-warning";
      break;
    case TroubleTicketContants.PRIORITY.P3:
      badgeText = "P3 (Low)";
      badgeIcon = "bi-exclamation-diamond-fill";
      iconColor = "text-success";
      break;
    default:
      break;
  }

  return `<span class=""><i class="${badgeIcon} ${iconColor} me-2"></i>${badgeText}</span>`;
}
export function RegionBadge(region) {
  region = region?.toLowerCase();
  let badgeText = "";
  let badgeClass = "";

  switch (region) {
    case "north":
      badgeText = "North";
      badgeClass = "badge bg-warning";
      break;
    case "south":
      badgeText = "South";
      badgeClass = "badge bg-danger";
      break;
    case "international":
      badgeText = "International";
      badgeClass = "badge bg-success";
      break;
    case "central":
      badgeText = "Central";
      badgeClass = "badge bg-info";
      break;
    default:
      badgeText = region;
      badgeClass = "badge bg-secondary";
      break;
  }
  return `<span class="${badgeClass}">${badgeText}</span>`;
}

export function RecordStatusBadge(status) {
  status = status?.toLowerCase();
  let badgeText = "";
  let badgeClass = "";
  switch (status) {
    case "active":
      badgeText = "Active";
      badgeClass = "badge bg-light-success text-success";
      break;
    case "inactive":
      badgeText = "In Active";
      badgeClass = "badge bg-light-danger text-danger";
      break;
    default:
      badgeText = status;
      badgeClass = "badge bg-secondary";
      break;
  }
  return `<span class="${badgeClass}">${badgeText}</span>`;
}

export function StatusBadge(status) {
  let badgeText = "";
  let badgeClass = "";
  switch (status) {
    case true:
      badgeText = `YES`;
      badgeClass = "badge bg-light-success text-success";
      break;
    case false:
      badgeText = "NO";
      badgeClass = "badge bg-light-danger text-danger";
      break;
    default:
      badgeText = status;
      badgeClass = "badge bg-secondary";
      break;
  }
  return `<span class="${badgeClass}">${badgeText}</span>`;
}

export function TroubleTicketStatusBadge(id, label) {
  let badge = "badge badge-pill ";
  switch (id) {
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.OPEN:
      badge += "badge-danger";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.ASSIGNED:
      badge += "badge-warning";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RESOLVED:
      badge += "badge-primary";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED:
      badge += "badge-success";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED:
      badge += "badge-success";
      break;
    default:
      badge += "badge-warning";
      break;
  }
  return `<span class="${badge}">${label?.replace(/_/g, " ")}</span>`;
}

export function TroubleTicketStatsCountColor(status) {
  let color = "";
  switch (status?.toLowerCase()) {
    case TroubleTicketContants.STATUS.RCA_REQUIRED.toLowerCase():
      color += "info";
      break;
    case TroubleTicketContants.STATUS.OPEN.toLowerCase():
      color += "danger";
      break;
    case TroubleTicketContants.STATUS.ASSIGNED.toLowerCase():
      color += "warning";
      break;
    case TroubleTicketContants.STATUS.RESOLVED.toLowerCase():
      color += "primary";
      break;
    case TroubleTicketContants.STATUS.COMPLETED.toLowerCase():
      color += "success";
      break;
    case TroubleTicketContants.STATUS.CANCELLED.toLowerCase():
      color += "success";
      break;
    default:
      color += "warning";
      break;
  }
  return color;
}

export function TroubleTicketStatsIcon(id) {
  let icon = "";
  switch (id) {
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.OPEN:
      icon += "fas fa-folder-open";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.ASSIGNED:
      icon += "fas fa-user-check";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RESOLVED:
      icon += "fas fa-check-circle";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RCA_AWAITED:
      icon += "fas fa-clock";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.REOPEN:
      icon += "fas fa-undo";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED:
      icon += "fas fa-flag-checkered";
      break;
    case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED:
      icon += "fas fa-flag-checkered";
      break;
    default:
      break;
  }
  return icon;
}

export function TroubleTicketViewModeEsclationLevel(esclationLevel) {
  // switch (esclationLevel) {
  //   case "L1":
  //     return `<p class="text-info p-0 m-0"><b> L1: Turn Around Time has reached 50% hours </b></p>`;
  //   case "L2":
  //     return `<p class="text-warning p-0 m-0"><b> L2: Turn Around Time has reached 100% hours </b></p> `;
  //   case "L3":
  //     return `<p class="text-danger p-0 m-0"><b> L3: Turn Around Time has reached 110% hours </b></p>`;
  //   default:
  //     return `<p class="p-0 m-0"><b> Ticket is not escalated yet.</b></p>`;
  // }
  switch (esclationLevel) {
    case "L1":
      return `<p class="text-info p-0 m-0"><b> L1: Turn Around Time</b></p>`;
    case "L2":
      return `<p class="text-warning p-0 m-0"><b> L2: Turn Around Time</b></p> `;
    case "L3":
      return `<p class="text-danger p-0 m-0"><b> L3: Turn Around Time</b></p>`;
    default:
      return `<p class="p-0 m-0"><b> Ticket is not escalated yet.</b></p>`;
  }
}

function parsePermissions(
  permissions: IPermission[],
  tree: any,
  disabledPermissions: IPermission[] = [] as IPermission[]
) {
  const permissionsIdsArray: number[] = permissions.map((permission) => {
    const [name, access] = permission.name.split("-");

    const isDisabled = disabledPermissions.some((p) => p.id === permission.id);

    if (!tree[name]) {
      tree[name] = {
        label: name,
        id: [permission.id],
        children: [
          {
            id: permission.id,
            label: access,
            disabled: isDisabled, // Disable the child permission if its id is in disabledPermissions
          },
        ],
      };
    } else {
      tree[name].id.push(permission.id);
      tree[name].children.push({
        id: permission.id,
        label: access,
        disabled: isDisabled, // Disable the child permission if its id is in disabledPermissions
      });
    }

    return permission.id;
  });

  return permissionsIdsArray;
}

export function getRolePermissionsTree(
  currentPermissions: IPermission[],
  remainingPermissions: IPermission[],
  disabledPermissions: IPermission[] = [] as IPermission[]
) {
  const tree: any = {};

  const currentPermissionsIdsArray = parsePermissions(
    currentPermissions,
    tree,
    disabledPermissions
  );
  const remainingPermissionsIdsArray = parsePermissions(
    remainingPermissions,
    tree
  );

  // Get all unique permission ids
  const allPermissionsIdsArray = Array.from(
    new Set([...currentPermissionsIdsArray, ...remainingPermissionsIdsArray])
  );

  // Update tree nodes, if all children are disabled then parent is also disabled
  Object.values(tree).forEach((node: any) => {
    node.disabled = node.children.every((child: any) => child.disabled);
  });

  // Create the "All permissions" root node
  const root = {
    label: "All permissions",
    id: allPermissionsIdsArray,
    disabled: Object.values(tree).every((node: any) => node.disabled), // if all children are disabled, root is also disabled
    children: Object.values(tree),
  };

  return {
    currentPermissionsIdsArray,
    remainingPermissionsIdsArray,
    tree: [root], // Return a single-element array containing the root node
    rootId: [root.id], // controls the expansion of root node
  };
}

export const replaceSpacesInKeysWithUnderScore = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/ /g, "_"); // Replace all spaces in key with underscore
    newObj[newKey] = obj[key]; // Add the key-value pair to new object
  });

  return newObj;
};

export const replaceUnderScoreInKeysWithSpacesForArray = (array) => {
  return array.map((obj) => {
    const transformedObj = {};
    Object.keys(obj).forEach((key) => {
      const transformedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      transformedObj[transformedKey] = obj[key];
    });
    return transformedObj;
  });
};

export function removeEmptyStringValuesFromObject(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    if (obj[key] !== "") {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}

function stringifyArraysInObject(obj) {
  if (!_.isObject(obj)) {
    throw new Error("Input is not an object");
  }

  const result = _.mapValues(obj, (value) => {
    if (_.isArray(value)) {
      return JSON.stringify(value);
    }
    return value;
  });

  return result;
}

export function removeEmptyArrayFromObject(obj) {
  return _.pickBy(obj, (value) => {
    if (_.isArray(value)) {
      return !_.isEmpty(value);
    }
    return true;
  });
}

//this func performs data preprocessing before sending it to server
// like converting array to string format
export function prepareDataForServer(obj: any) {
  obj = removeEmptyArrayFromObject(obj);
  obj = stringifyArraysInObject(obj);
  obj = removeEmptyStringValuesFromObject(obj);
  return obj;
}

export function toastForSendEmail(
  response: AxiosResponse,
  message: string,
  resource?: string
) {
  if (response.status === 201) {
    ElNotification({
      title: "Success",
      message: `${response.data.message || message}`,
      type: "success",
    });
    resource && router.push({ name: `${resource}-list` });
  } else {
    ElNotification({
      title: "Error",
      message: `${response.data.message}`,
      type: "error",
      duration: 0,
    });
  }
}

export function makeListForDropDowm(
  data: basicDropDownListValue
): basicDropDownListValue[] {
  return lodash.map(data, (item) => ({
    key: item.id,
    label: `${item.name}`,
  }));
}

export const getDatetimeOneWeekAgo = () => {
  const toDate = new Date();

  // Calculate the date one week ago by subtracting 7 days from the current date
  const oneWeekAgo = new Date(toDate);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return {
    from_date: oneWeekAgo,
    to_date: toDate,
  };
};
export const getDatetimeOneMonthAgo = () => {
  const toDate = new Date();
  const oneMonthAgo = new Date(toDate);
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  return {
    from_date: oneMonthAgo,
    to_date: toDate,
  };
};

export const widgetAlarmsListenerFilter = async (filterAgainst, data) => {
  const keys = Object.keys(filterAgainst);

  return keys.every((key) =>
    typeof filterAgainst[key] === "string" && typeof data[key] === "string"
      ? filterAgainst[key].toLowerCase() === data[key].toLowerCase()
      : filterAgainst[key] === data[key]
  )
    ? data
    : null;
};

export const pagesObject = (data) => {
  return {
    heading: data?.name,
    route: `/dashboard/${data?.id}`,
  };
};

export const paramsConversionNetworkType = (networkType, params) => {
  const filterKeys = AlarmsModel[networkType];

  const convertedObject = {};

  Object.entries(params).forEach(([key, value]) => {
    const filterKey = filterKeys[key];
    if (filterKey) convertedObject[filterKey] = value;
  });

  return Object.keys(convertedObject).length ? convertedObject : {};
};

export const paramsConversionAppType = (appType, params) => {
  const filterKeys = AlarmsAppTypeModel[appType];

  const convertedObject = {};

  Object.entries(params).forEach(([key, value]) => {
    const filterKey = filterKeys[key];
    if (filterKey) convertedObject[filterKey] = value;
  });

  return Object.keys(convertedObject).length ? convertedObject : {};
};

export const handleImageError = (event) => {
  event.target.src = AppConstants.HANDLE_IMAGE_ERROR_URL;
};

export const encodeUrl = (url) => {
  url = url.replace("%", "%25");
  url = url.replace(",", "%2C");
  url = url.replace("#", "%23");
  url = url.replace(">", "%3E");
  url = url.replace("<", "%3C");
  url = url.replace('""', "%22");
  url = url.replace("|", "%7C");
  return url;
};

export const mapToTargetObject = (target, data) => {
  const result = {};
  Object.keys(target).forEach((targetKey) => {
    result[targetKey] = data[targetKey];
  });
  return result;
};

export const removeNullValuesFromArray = (target) => {
  return target.map((obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
        obj[key] = "";
      }
    });
    return obj;
  });
};

export const timeDifferenceFromNow = (date: Date): string => {
  const now = moment();
  const inputDate = moment(date);
  const diffDays = now.startOf("day").diff(moment(date).startOf("day"), "days");
  const diffMonths = now.diff(inputDate, "months");

  if (diffDays === 0) {
    return inputDate.format("h:mm a");
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffMonths < 1) {
    return inputDate.format("D MMM");
  } else {
    return inputDate.format("D MMM");
  }
};

export const calculateTimeDifference = async (
  startTime: Date | null,
  endTime: Date | null,
  subtractMinutes?: number
) => {
  // Parse input timestamps using Moment.js
  const startMoment = moment(startTime);
  let endMoment = moment(endTime);

  // Subtract minutes from the endTime if subtractMinutes is provided and greater than 0
  if (subtractMinutes && subtractMinutes > 0) {
    endMoment = endMoment.subtract(subtractMinutes, "minutes");
  }

  // Calculate difference in days
  const daysDiff = endMoment.diff(startMoment, "days");

  // Calculate remaining difference in hours after subtracting days
  const hoursDiff = endMoment.diff(startMoment, "hours") % 24;

  // Calculate difference in minutes after subtracting days and hours
  const minutesDiff = endMoment.diff(startMoment, "minutes") % 60;

  let duration = "";

  if (daysDiff > 0) {
    duration = duration + `${daysDiff} ${daysDiff > 1 ? "days" : "day"}`;
  }
  if (hoursDiff > 0) {
    duration =
      duration +
      `${
        daysDiff > 0 && minutesDiff > 0 ? " ," : daysDiff > 0 ? " and" : ""
      } ${hoursDiff} ${hoursDiff > 1 ? "hours" : "hour"}`;
  }
  if (minutesDiff > 0) {
    duration =
      duration +
      ` ${
        daysDiff > 0 && hoursDiff > 0
          ? " and"
          : daysDiff > 0
          ? " and"
          : hoursDiff > 0
          ? " and"
          : ""
      } ${minutesDiff} ${minutesDiff > 1 ? "minutes" : "minute"}`;
  }

  return duration;
};

export const convertTime = async (time: any) => {
  const updateTime = +time;

  const hours = Math.floor(updateTime / 60);
  const minutes = updateTime % 60;
  if (hours > 0) {
    return `${hours}${hours > 1 ? " hours" : " hour"}, ${minutes} ${
      minutes > 1 ? "minutes" : "minute"
    }`;
  }
  return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
};

export const disableDates = (time: Date): boolean => {
  const date = new Date();
  const previousDate = date.setDate(date.getDate());
  return time.getTime() > previousDate;
};

export const appTypetoPresentationLayer = (appType) => {
  if (appType === AppConstants.APP_TYPE.NCE) {
    return AppConstants.NCE_PRESENTATION_NAME;
  } else if (appType === AppConstants.APP_TYPE.OBSERVIUM) {
    return AppConstants.OBSERVIUM_PRESENTATION_NAME;
  } else if (appType === AppConstants.APP_TYPE.NCE_GPON) {
    return AppConstants.NCE_GPON_PRESENTATION_NAME;
  } else if (appType === AppConstants.APP_TYPE.NOKIA_TXN) {
    return AppConstants.NOKIA_TXN_PRESENTATION_NAME;
  } else if (appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS) {
    return AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME;
  } else {
    return null;
  }
};

export const playAlarmSound = (
  networkType: string,
  severity: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const beepAudio = new Audio(ALARM_CONFIG[networkType][severity].fileName);
    if (beepAudio) {
      beepAudio
        .play()
        .catch((error) => {
          console.log("Audio playback failed:", error);
        })
        .finally(() => resolve(true));
    }
  });
};

export const playAlarmSoundBG = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const beepAudio = new Audio(ALARM_CONFIG.alarmNotificationSound);
    if (beepAudio) {
      beepAudio
        .play()
        .catch((error) => {
          console.log("Audio playback failed:", error);
        })
        .finally(() => resolve(true));
    }
  });
};

/**
 * @description Network Type fetcher against ' App Type'
 * @param appType
 * @returns
 */
export const getNetworkTypeByAppType = (appType) => {
  switch (appType) {
    case AppConstants.APP_TYPE.NCE:
      return AppConstants.NETWORK_TYPE.TRANSMISSION;
      break;
    case AppConstants.APP_TYPE.NOKIA_TXN:
      return AppConstants.NETWORK_TYPE.TRANSMISSION;
      break;
    case AppConstants.APP_TYPE.OBSERVIUM:
      return AppConstants.NETWORK_TYPE.IP;
      break;
    case AppConstants.APP_TYPE.NCE_GPON:
      return AppConstants.NETWORK_TYPE.GPON;
      break;
    case AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS:
      return AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH;
      break;
    default:
      return "";
      break;
  }
};

export const getAppTypeByNetworkType = (networkType) => {
  switch (networkType) {
    case AppConstants.NETWORK_TYPE.TRANSMISSION:
      return AppConstants.APP_TYPE.NCE;
      break;
    case AppConstants.NETWORK_TYPE.IP:
      return AppConstants.APP_TYPE.OBSERVIUM;
      break;
    case AppConstants.NETWORK_TYPE.GPON:
      return AppConstants.APP_TYPE.NCE_GPON;
      break;
    default:
      return "";
      break;
  }
};

/**
 * @description Returns module AppTYPE wise severity field_name / field_key
 * @param appType
 * @returns
 */
export const severityMapper = (appType) => {
  switch (appType) {
    case AppConstants.APP_TYPE.NCE:
      return "severity";
      break;
    case AppConstants.APP_TYPE.OBSERVIUM:
      return "alert_severity";
      break;
    case AppConstants.APP_TYPE.NCE_GPON:
      return "severity";
      break;
    case AppConstants.APP_TYPE.NOKIA_TXN:
      return "severity";
      break;
    case AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS:
      return "severity";
      break;
    default:
      return "severity";
      break;
  }
};

export const appTypeMapperByTableFilterColumnKey = (tableFilterColumnKey) => {
  switch (tableFilterColumnKey) {
    case AppConstants.TABLE_FILTER_COLUMN_KEYS.NCE_ALARM_LIST:
      return AppConstants.APP_TYPE.NCE;
      break;
    case AppConstants.TABLE_FILTER_COLUMN_KEYS.OBSERVIUM_ALARM_LIST:
      return AppConstants.APP_TYPE.OBSERVIUM;
      break;
    case AppConstants.TABLE_FILTER_COLUMN_KEYS.NCE_GPON_ALARM_LIST:
      return AppConstants.APP_TYPE.NCE_GPON;
      break;
    case AppConstants.TABLE_FILTER_COLUMN_KEYS.NOKIA_TXN_ALARM_LIST:
      return AppConstants.APP_TYPE.NOKIA_TXN;
      break;
    case AppConstants.TABLE_FILTER_COLUMN_KEYS.LDI_SOFTSWITCH_EMS_ALARM_LIST:
      return AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS;
      break;
    default:
      return "";
      break;
  }
};

/**
 * @description Compute alerts table cell color by alarms-severity
 * @param appType
 * @returns
 */
export const getSeverityCellColorByAppType = (appType) => {
  return (data) => {
    const severity = data[severityMapper(appType)].toLowerCase();
    const result = {
      boxClass: "",
      boxStyle: {
        "background-color": "",
      },
    };
    if (severity) {
      const network = getNetworkTypeByAppType(appType);
      if (
        ALARM_CONFIG[network][severity] &&
        ALARM_CONFIG[network][severity].boxColor
      ) {
        const colorConfigBySeverity =
          ALARM_CONFIG[network][severity].boxColor[themeMode.value];
        let bgColor = "";
        if (data.is_cleared) {
          bgColor = colorConfigBySeverity.up;
        } else {
          bgColor = colorConfigBySeverity.down;
        }
        result.boxStyle = {
          "background-color": bgColor,
        };
      }
    }
    return { ...result };
  };
};

export const closeKTSideBar = () => {
  const element = document.querySelector<HTMLElement>("[data-kt-toggle]");

  if (element) {
    let toggleInstance = ToggleComponent.getInstance(
      element
    ) as ToggleComponent;

    if (!toggleInstance) {
      toggleInstance = new ToggleComponent(element, { saveState: true });
    }

    store.commit(Mutations.SET_SIDEBAR_MINIMIZE, true);
    toggleInstance.enable();
  }
};

export const getTroubleTicketSideAlarmComponent = (appType) => {
  switch (appType) {
    case AppConstants.APP_TYPE.NCE:
      return NceAlarmDetailSide;
    case AppConstants.APP_TYPE.OBSERVIUM:
      return ObserviumAlarmDetailSide;
    case AppConstants.APP_TYPE.NCE_GPON:
      return NceGponAlarmDetailSide;
    case AppConstants.APP_TYPE.NOKIA_TXN:
      return NokiaTXNAlarmDetailSide;
    case AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS:
      return LDISoftswitchEMSAlarmDetailSide;
    default:
      break;
  }
};

export const getAppTypeByNetworkAndApptypeBase64String = (base64String) => {
  const appType = window.atob(base64String).split("-")[1];
  return appType;
};
