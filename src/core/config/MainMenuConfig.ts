import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

const DocMenuConfig = [
  {
    heading: "Dashboards",
    list: true,
    pages: [
      {
        heading: "Dashboards",
        route: "/dashboard",
        permission: "",
        fontIcon: "fa-solid fa-chart-area",
        // addButton: true,
        // customButtonRoute: "/custom-dashboard/create",
        sub: [
          {
            heading: "Default Dashboard",
            route: "/dashboard",
          },
        ],
      },
      {
        heading: "Add New",
        route: "/custom-dashboard/create",
        permission: "",
        fontIcon: "fa-solid fa-plus",
      },
    ],
  },
  {
    heading: "Trouble Ticket",
    permission: permissions.troubleTicket.access,
    pages: [
      {
        heading: "Dashboard",
        route: "/trouble-ticket-dashboard",
        fontIcon: "fa-solid fa-chart-simple",
      },
      {
        heading: "Tickets",
        route: "/trouble-ticket/list",
        fontIcon: "fa-solid fa-flag",
      },
      {
        heading: "Categories",
        route: "/category/list",
        fontIcon: "fa-solid fa-table-list",
        permission: permissions.troubleTicketCategory.access,
      },
      {
        heading: "Reports",
        route: "/reports/trouble-ticket",
        fontIcon: "fa-solid fa-list-ul",
      },
    ],
  },
  {
    heading: "Networks Monitoring",
    pages: [
      {
        sectionTitle: `${AppConstants.NCE_PRESENTATION_NAME}`,
        permission: permissions.nce.network,
        fontIcon: "fas fa-broadcast-tower",
        sub: [
          {
            heading: "Alarms",
            route: "/alarms/transmission",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-bell",
            permission: permissions.nce.alarms,
          },
          {
            heading: "Alarms Configuration",
            route: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NCE}/list`,
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-cog",
            permission: permissions.nceAlarmConfig.access,
          },
          {
            heading: "Devices",
            route: "/devices/transmission",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-server",
            permission: permissions.nce.devices,
          },
        ],
      },
      {
        sectionTitle: AppConstants.OBSERVIUM_PRESENTATION_NAME,
        permission: permissions.observium.network,
        fontIcon: "fas fa-globe",
        sub: [
          {
            heading: "Alarms",
            route: "/alarms/ip",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-bell",
            permission: permissions.observium.alarms,
          },
          {
            heading: "Alarms Configuration",
            route: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.IP_OBSERVIUM}/list`,
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-cog",
            permission: permissions.observiumAlarmConfig.access,
          },
          {
            heading: "Devices",
            route: "/devices/ip",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-server",
            permission: permissions.observium.devices,
          },
        ],
      },
      {
        sectionTitle: `${AppConstants.NCE_GPON_PRESENTATION_NAME}`,
        permission: permissions.nceGpon.network,
        fontIcon: "fas fa-ethernet",
        sub: [
          {
            heading: "Alarms",
            route: "/alarms/nce-gpon",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-bell",
            permission: permissions.nceGpon.alarms,
          },
          {
            heading: "Alarms Configuration",
            route: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.GPON_NCE_GPON}/list`,
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-cog",
            permission: permissions.nceGponAlarmConfig.access,
          },
          {
            heading: "Devices",
            route: "/devices/nce-gpon",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-server",
            permission: permissions.nceGpon.devices,
          },
        ],
      },
      {
        sectionTitle: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME}`,
        permission: permissions.nokiaTXN.network,
        fontIcon: "fas fa-network-wired",
        sub: [
          {
            heading: "Alarms",
            route: "/alarms/nokia-txn",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-bell",
            permission: permissions.nokiaTXN.alarms,
          },
          {
            heading: "Alarms Configuration",
            route: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NOKIA_TXN}/list`,
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-cog",
            permission: permissions.nokiaTXNAlarmConfig.access,
          },
          {
            heading: "Devices",
            route: "/devices/nokia-txn",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-server",
            permission: permissions.nokiaTXN.devices,
          },
        ],
      },
      {
        sectionTitle: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME}`,
        permission: permissions.ldiSoftswitchEMS.network,
        fontIcon: "fas fa-exchange-alt",
        sub: [
          {
            heading: "Alarms",
            route: "/alarms/ldi-softswitch",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-bell",
            permission: permissions.ldiSoftswitchEMS.alarms,
          },
          {
            heading: "Alarms Configuration",
            route: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.LDI_SOFTSWITCH_EMS}/list`,
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-cog",
            permission: permissions.ldiSoftswitchEMSAlarmConfig.access,
          },
          {
            heading: "Trunk Group List",
            route: "/trunk-group/ldi-softswitch",
            svgIcon: "/media/icons/duotune/general/gen022.svg",
            fontIcon: "fa-solid fa-server",
            permission: permissions.ldiSoftswitchEMS.trunkGroup,
          },
        ],
      },
    ],
  },
  {
    heading: "User Mangement",
    route: "/users/list",
    permission: permissions.userManagement.access,
    pages: [
      {
        heading: "Users",
        route: "/users/list",
        svgIcon: "/media/icons/duotune/general/gen022.svg",
        fontIcon: "fa-solid fa-users",
        permission: permissions.users.access,
      },
      {
        heading: "Roles",
        route: "/roles/list",
        svgIcon: "/media/icons/duotune/general/gen022.svg",
        fontIcon: "fa-solid fa-user-lock",
        permission: permissions.role.access,
      },
      // {
      //   heading: "Permissions",
      //   route: "/permissions/list",
      //   svgIcon: "/media/icons/duotune/communication/com006.svg",
      //   fontIcon: "fa-solid fa-user-lock",
      //   permission: permissions.permissions.access,
      // },
    ],
  },
  {
    heading: "Notifications",
    permission: permissions.emailLogs.access,
    pages: [
      {
        heading: "Email Logs",
        route: "/email-logs/list",
        svgIcon: "/media/icons/duotune/general/gen022.svg",
        fontIcon: "fa-solid fa-envelope",
        permission: permissions.emailLogs.access,
      },
    ],
  },
  {
    heading: "HRM",
    route: "/hrm",
    permission: permissions.hrm.access,
    pages: [
      {
        heading: "Department",
        route: "/department/list",
        svgIcon: "/media/icons/duotune/building/building.svg",
        fontIcon: "fa fa-building",
        permission: permissions.department.access,
      },
      {
        heading: "Sub Department",
        route: "/sub-department/list",
        svgIcon: "/media/icons/duotune/finance/fin006.svg",
        fontIcon: "fa-solid fa-sitemap",
        permission: permissions.subDepartment.access,
      },
      {
        heading: "Designation",
        route: "/designation/list",
        svgIcon: "/media/icons/duotune/ecommerce/ecm002.svg",
        fontIcon: "fa-solid fa-user-tie",
        permission: permissions.designation.access,
      },
    ],
  },
];

export default DocMenuConfig;
