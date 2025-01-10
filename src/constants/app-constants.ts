import beep from "@/assets/sounds/beep.mp3";
import mixkit from "@/assets/sounds/mixkit-classic-alarm.wav";
import BackgoundAlarmSound from "@/assets/sounds/BackgoundAlarmSound.wav";

export const AppConstants = Object.freeze({
  DATATABLE_SETTINGS: {
    PER_PAGE_LIMIT: 25,
  },
  CUSTOM_DASHBOARD_LIST: {
    PER_PAGE_LIMIT: 15,
  },
  DATE_FORMATS: {
    DATE: "DD/MM/yyyy",
    ISO_DATE: "yyyy-MM-DD",
    DATETIME: "DD/MM/yyyy hh:mm:ss A",
    DATETIME_FOR_FROM_TO_SELECTOR: "DD-MM-YYYY ddd hh:mm:ss A",
  },
  SOCKET_EVENTS: {
    NCE_ALARMS: "nce-alarms",
    OBSERVIUM_ALARMS: "observium-alarms",
    NCE_GPON_ALARMS: "nce-gpon-alarms",
    NOKIA_TXN_ALARMS: "nokia-txn-alarms",
    LDI_SOFTSWITCH_EMS_ALARMS: "ldi-softswitch-alarms",
    REFRESH_DASHBOARD_IP: "refresh-dashboard-ip",
    REFRESH_DASHBOARD_TRANSMISSION: "refresh-dashboard-transmission",
    REFRESH_DASHBOARD_GPON: "refresh-dashboard-gpon",
    REFRESH_DASHBOARD_NOKIA_TXN: "refresh-dashboard-nokia-txn",
    REFRESH_DASHBOARD_LDI_SOFTSWITCH_EMS: "refresh-dashboard-ldi-softswitch",
    WEBAPP_UPDATE: "webapp-update",
    TROUBLE_TICKET_NOTIFICATION: "trouble_ticket_notification",
  },
  NCE_PRESENTATION_NAME: "LH-TX",
  NCE_GPON_PRESENTATION_NAME: "GPON",
  OBSERVIUM_PRESENTATION_NAME: "IP",
  NOKIA_TXN_PRESENTATION_NAME: "Nokia-TXN",
  LDI_SOFTSWITCH_EMS_PRESENTATION_NAME: "LDI-Softswitch",
  NETWORK_TYPE: {
    TRANSMISSION: "transmission",
    IP: "ip",
    GPON: "gpon",
    LDI_SOFTSWITCH: "ldi_softswitch",
  },
  APP_TYPE: {
    NCE: "NCE",
    OBSERVIUM: "OBSERVIUM",
    NCE_GPON: "NCE_GPON",
    NOKIA_TXN: "NOKIA_TXN",
    LDI_SOFTSWITCH_EMS: "LDI_SOFTSWITCH_EMS",
  },
  NETWORK_TYPE_APP_TYPE_BASE64_STRINGS: {
    TRANSMISSION_NCE: "dHJhbnNtaXNzaW9uLU5DRQ==",
    IP_OBSERVIUM: "aXAtT0JTRVJWSVVN",
    GPON_NCE_GPON: "Z3Bvbi1OQ0VfR1BPTg==",
    TRANSMISSION_NOKIA_TXN: "dHJhbnNtaXNzaW9uLU5PS0lBX1RYTg==",
    LDI_SOFTSWITCH_EMS: "bGRpX3NvZnRzd2l0Y2gtTERJX1NPRlRTV0lUQ0hfRU1T",
  },
  DASHBOARD_WIDGET_TYPE: "DASHBOARD_WIDGET_TYPE",
  DASHBOARD_STATS: {
    COUNTS_PERIOD_TYPES: {
      LAST_24_HOURS: "LAST_24_HOURS",
      LAST_WEEK: "LAST_WEEK",
      LAST_MONTH: "LAST_MONTH",
    },
  },
  FILTER_TEMPLATE_TYPES: {
    OBSERVIUM: "observium-alarms-filters",
    NCE: "nce-alarms-filters",
    NCE_GPON: "nce-gpon-alarms-filters",
    NOKIA_TXN: "nokia-txn-alarms-filters",
    LDI_SOFTSWITCH_EMS: "ldi-softswitch-alarms-filter",
  } as const,
  DATA_FETCH_RATE_LIMITING: {
    DEBOUNCE: 10000,
    MAXWAIT: 10000,
  },
  GLOBAL_SETTING_TYPES: {
    CRM_WEB_APP_VERSION: 1,
    USER_NOTIFICATION: 2,
    ALARM_FILTER_CONFIG_SETTINGS: 3,
  },
  SIDE_MENU_ITEMS: {
    SIDE_MENU_SUB_ITEM_LENGTH: 30,
  },
  HANDLE_IMAGE_ERROR_URL: "/media/avatars/blank.png",
  EMPTY_DATA_IMAGE_URL: "/media/illustrations/sigma-1/21.png",
  ALLOWED_MAX_FILE_SIZE: 20,
  TURN_AROUND_TIME_UNIT: [
    { value: "MINUTES", label: "Minutes" },
    { value: "HOURS", label: "Hours" },
  ],
  USER_TYPE: [
    { value: "EMPLOYEE", label: "Employee" },
    { value: "GROUP", label: "Group" },
  ],
  HEADER_USER_INFO_LENGTH: 15,
  SERVER_DOWN_ERROR: "Either your network is not working or Server is down",
  NOTIFICATION_LIST: {
    PER_PAGE_LIMIT: 100,
  },
  CUSTOM_DASHBOARD_HEADER_ALARM_LENGTH: 30,
  TROUBLE_TICKET_HEADER_ALARM_LENGTH: 30,
  TROUBLE_TICKET_LIST_ALARM_LENGTH: 40,
  NOTIFICATION_SOUNDS: {
    NCE: {
      SEVERITY: {
        CRITICAL: "critical",
      },
    },
    OBSERVIUM: {
      SEVERITY: {
        CRITICAL: "critical",
      },
    },
  },
  ALARM_SEVERITIES: {
    NCE: {
      CRITICAL: "critical",
      MAJOR: "major",
      MINOR: "minor",
      WARNING: "warning",
    },
    OBSERVIUM: {
      CRITICAL: "critical",
      WARNING: "warning",
      NOTIFICATION: "notification",
    },
    NCE_GPON: {
      CRITICAL: "critical",
      MAJOR: "major",
      MINOR: "minor",
      WARNING: "warning",
    },
    NOKIA_TXN: {
      CRITICAL: "critical",
      MAJOR: "major",
      MINOR: "minor",
      WARNING: "warning",
    },
    LDI_SOFTSWITCH_EMS: {
      CRITICAL_ERROR: "critical error",
      MAJOR_ERROR: "major error",
      MINOR_ERROR: "minor error",
      WARNING: "warning",
    },
  },
  MEDIUM: {
    OBSERVIUM: "OBSERVIUM_NMS",
    NCE: "NCE_NMS",
  },
  FILTER_KEYS: {
    OPEN_TROUBLE_TICKET: "OPEN_TROUBLE_TICKET",
  },
  TABLE_FILTER_COLUMN_KEYS: {
    NCE_ALARM_LIST: "NCE_ALARM_LIST",
    OBSERVIUM_ALARM_LIST: "OBSERVIUM_ALARM_LIST",
    NCE_GPON_ALARM_LIST: "NCE_GPON_ALARM_LIST",
    NOKIA_TXN_ALARM_LIST: "NOKIA_TXN_ALARM_LIST",
    LDI_SOFTSWITCH_EMS_ALARM_LIST: "LDI_SOFTSWITCH_EMS_ALARM_LIST",
    TROUBLE_TICKET_LIST: "TROUBLE_TICKET_LIST",
    TROUBLE_TICKET_REPORT_LIST: "TROUBLE_TICKET_REPORT_LIST",
  },
  THEME_MODE: {
    LIGHT: "light",
    DARK: "dark",
  },
  ALARM_FROM_SOCKET_APP_NOTIFICATION_KEYS: {
    LH_TX: "LH-TX",
    IP: "IP",
  },
});

export const ROUTES = {
  DASHBOARD: {
    INDEX: "/dashboard",
  },
  SIGNIN: {
    NAME: "sign-in",
  },
};

export const TroubleTicketContants = Object.freeze({
  STATUS: {
    RECEIVED: "RECEIVED",
    ASSIGNED: "ASSIGNED",
    RESOLVED: "RESOLVED",
    COMPLETED: "COMPLETED",
    RCA_REQUIRED: "RCA_REQUIRED",
    OPEN: "OPEN",
    REOPENED: "REOPEN",
    PAUSE: "PAUSED",
    CANCELLED: "CANCELED",
    RCA_AWAITED: "RCA AWAITED",
  },
  BUTTON_STATUS: {
    LEAVE: "leave",
    RE_OPEN: "reopen",
    SEND_BACK: "send_back",
    UPDATE: "update",
    RCA_REQUIRED: "rca_required",
    RCA_AWAITED: "RCA_AWAITED",
    RCA_SUBMIT: "rca_submit",
    PAUSE_REQUEST: "pause_request",
    PAUSE_REQUEST_APPROVE: "pause_request_approve",
    PAUSE_REQUEST_CANCEL: "pause_request_cancel",
    RESOLVE: "resolved",
    COMPLETE: "completed",
    CANCEL: "cancel",
  },
  TROUBLE_TICKET_STATUS_IDS: {
    OPEN: 32,
    ASSIGNED: 33,
    RESOLVED: 34,
    COMPLETED: 35,
    REOPEN: 36,
    CANCELLED: 39,
    PAUSE: 43,
    RCA_AWAITED: 51,
  },
  TAB_QUERYPARAMS: {
    PAUSE_REQUEST: "pauseRequest",
    RCA_REQUEST: "rcaRequired",
  },
  PRIORITY: {
    P1: 48,
    P2: 49,
    P3: 50,
  },
});

export const USER_SETTING_TYPES = Object.freeze({
  RECEIVE_EMAIL: "receive_email",
  RECEIVE_SMS: "receive_sms",
  RECEIVE_NOTIFICATION: "receive_notification",
});

export const ALARM_CONFIG = Object.freeze({
  playing_sound_timewindow_ms: 10000, // 15 seconds,
  playing_sound_bg_timewindow_ms: 5000, // 15 seconds,
  alarmNotificationSound: BackgoundAlarmSound,
  ip: {
    critical: {
      fileName: mixkit,
      keyName: "critical",
      boxColor: {
        light: { up: "#90EE90", down: "#FFB6C1" },
        dark: { up: "#013220", down: "#4d0000" },
      },
    },
    major: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "major",
    },
    minor: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "minor",
    },
    warning: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "warning",
      boxColor: {
        light: { up: "#90EE90", down: "#FFFFC5" },
        dark: { up: "#013220", down: "#242300" },
      },
    },
  },
  transmission: {
    critical: {
      fileName: mixkit,
      keyName: "critical",
      boxColor: {
        light: { up: "#90EE90", down: "#FFB6C1" },
        dark: { up: "#013220", down: "#4d0000" },
      },
    },
    major: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "major",
    },
    minor: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "minor",
    },
    warning: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "warning",
      boxColor: {
        light: { up: "#90EE90", down: "#FFFFC5" },
        dark: { up: "#013220", down: "#242300" },
      },
    },
  },
  gpon: {
    critical: {
      fileName: mixkit,
      keyName: "critical",
      boxColor: {
        light: { up: "#90EE90", down: "#FFB6C1" },
        dark: { up: "#013220", down: "#4d0000" },
      },
    },
    major: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "major",
    },
    minor: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "minor",
    },
    warning: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "warning",
      boxColor: {
        light: { up: "#90EE90", down: "#FFFFC5" },
        dark: { up: "#013220", down: "#242300" },
      },
    },
  },
  ldi_softswitch: {
    ["critical error"]: {
      fileName: mixkit,
      keyName: "critical",
      boxColor: {
        light: { up: "#90EE90", down: "#FFB6C1" },
        dark: { up: "#013220", down: "#4d0000" },
      },
    },
    ["major error"]: {
      fileName: mixkit,
      keyName: "critical",
      boxColor: {
        light: { up: "#90EE90", down: "#FFB6C1" },
        dark: { up: "#013220", down: "#4d0000" },
      },
    },
    ["minor error"]: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "minor",
    },
    warning: {
      fileName: "@/assets/sounds/beep.mp3",
      keyName: "warning",
      boxColor: {
        light: { up: "#90EE90", down: "#FFFFC5" },
        dark: { up: "#013220", down: "#242300" },
      },
    },
  },
});
