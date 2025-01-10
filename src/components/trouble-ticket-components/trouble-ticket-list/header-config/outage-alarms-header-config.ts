import { AppConstants } from "@/constants/app-constants";

export const OutageAlarmsHeaderConfig = {
  [AppConstants.APP_TYPE.OBSERVIUM]: [
    {
      columnLabel: "severity",
      key: "alert_severity",
    },
    { columnLabel: "device name", key: "device_hostname" },
    {
      key: "entity_name",
    },
    {
      key: "entity_type",
    },
    {
      key: "entity_description",
      textOverflow: true,
    },
    {
      columnLabel: "message",
      key: "alert_message",
      textOverflow: false,
    },
    {
      key: "alert_timestamp",
      columnLabel: "occured On",
    },
    {
      columnLabel: "cleared on",
      key: "cleared_on",
    },
  ],
};
