import { AppConstants } from "@/constants/app-constants";

// Socket filteration keys

export const AlarmsModel = {
  // FOR LH-TX
  [AppConstants.NETWORK_TYPE.TRANSMISSION]: {
    alarmName: "native_probable_cause",
    deviceName: "ne_resource_id",
    severity: "severity",
  },
  // FOR IP
  [AppConstants.NETWORK_TYPE.IP]: {
    alarmName: "alert_message",
    deviceName: "device_id",
    severity: "alert_severity",
  },
  // FOR GPON
  [AppConstants.NETWORK_TYPE.GPON]: {
    alarmName: "native_probable_cause",
    deviceName: "ne_resource_id",
    severity: "severity",
  },
};

export const AlarmsAppTypeModel = {
  // FOR LH-TX
  [AppConstants.APP_TYPE.NCE]: {
    alarmName: "native_probable_cause",
    deviceName: "ne_resource_id",
    severity: "severity",
  },
  // FOR IP
  [AppConstants.APP_TYPE.OBSERVIUM]: {
    alarmName: "alert_message",
    deviceName: "device_id",
    severity: "alert_severity",
  },
  // FOR GPON
  [AppConstants.APP_TYPE.NCE_GPON]: {
    alarmName: "native_probable_cause",
    deviceName: "ne_resource_id",
    severity: "severity",
  },
  // FOR NOKIA-TXN
  [AppConstants.APP_TYPE.NOKIA_TXN]: {
    alarmName: "alarm_name",
    deviceName: "ne_nokia_id",
    severity: "severity",
  },
};
