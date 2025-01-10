export const emailModel = {
  subject: "",
  to: "",
  cc: "" as string,
};

export const alarmEmailModel = {
  alarmId: 0,
  ...emailModel,
};

export const emailLogsModel = {
  logId: 0,
  id: 0,
  ...emailModel,
};
