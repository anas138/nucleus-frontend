export const permissions = Object.freeze({
  users: {
    create: "users-create",
    edit: "users-edit",
    delete: "users-delete",
    access: "users-acess",
  },
  permissions: {
    create: "permissions-create",
    access: "permissions-access",
    edit: "permissions-edit",
    delete: "permissions-delete",
  },
  department: {
    create: "department-create",
    edit: "department-edit",
    access: "department-access",
    delete: "department-delete",
  },
  subDepartment: {
    create: "subdepartment-create",
    edit: "subdepartment-edit",
    access: "subdepartment-access",
    delete: "subdepartment-delete",
  },
  designation: {
    create: "designation-create",
    edit: "designation-edit",
    access: "designation-access",
    delete: "designation-delete",
  },
  role: {
    create: "role-create",
    edit: "role-edit",
    access: "role-access",
    delete: "role-delete",
  },
  nce: {
    network: "tx-network",
    alarms: "tx-alarms",
    devices: "tx-devices",
    devicesSync: "tx-devicesSync",
  },
  nceAlarmConfig: {
    create: "txAlarmConfig-create",
    edit: "txAlarmConfig-edit",
    access: "txAlarmConfig-access",
  },
  observium: {
    alarms: "ip-alarms",
    devices: "ip-devices",
    network: "ip-network",
    devicesSync: "ip-devicesSync",
  },
  observiumAlarmConfig: {
    create: "ipAlarmConfig-create",
    edit: "ipAlarmConfig-edit",
    access: "ipAlarmConfig-access",
  },
  nceGpon: {
    network: "gpon-network",
    alarms: "gpon-alarms",
    devices: "gpon-devices",
    devicesSync: "gpon-devicesSync",
  },
  nceGponAlarmConfig: {
    create: "gponAlarmConfig-create",
    edit: "gponAlarmConfig-edit",
    access: "gponAlarmConfig-access",
  },
  nokiaTXN: {
    network: "nokiaTxn-network",
    alarms: "nokiaTxn-alarms",
    devices: "nokiaTxn-devices",
    devicesSync: "nokiaTxn-devicesSync",
  },
  nokiaTXNAlarmConfig: {
    create: "nokiaTxnAlarmConfig-create",
    edit: "nokiaTxnAlarmConfig-edit",
    access: "nokiaTxnAlarmConfig-access",
  },
  ldiSoftswitchEMS: {
    network: "ldiSoftswitch-network",
    alarms: "ldiSoftswitch-alarms",
    trunkGroup: "ldiSoftswitch-trunkGroup",
    trunkGroupSync: "ldiSoftswitch-trunkGroupSync",
  },
  ldiSoftswitchEMSAlarmConfig: {
    create: "ldiSoftswitchAlarmConfig-create",
    edit: "ldiSoftswitchAlarmConfig-edit",
    access: "ldiSoftswitchAlarmConfig-access",
  },
  emailLogs: {
    access: "emailLogs-access",
  },
  troubleTicket: {
    create: "troubleTicket-create",
    access: "troubleTicket-access",
    view_all: "troubleTicket-viewAllTickets",
    bulk_update: "troubleTicket-bulkUpdate",
  },
  troubleTicketCategory: {
    create: "troubleTicketCategory-create",
    access: "troubleTicketCategory-access",
    edit: "troubleTicketCategory-edit",
  },
  hrm: { access: "hrm-access" },
  userManagement: { access: "userManagement-access" },
});
