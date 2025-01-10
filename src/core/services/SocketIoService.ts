import { ALARM_CONFIG, AppConstants, ROUTES } from "@/constants/app-constants";
import store from "@/store";
import { nceMutations } from "@/store/enums/nce-enums";
import { observiumMutations } from "@/store/enums/observium-enums";
import { ElMessage } from "element-plus";
import { io } from "socket.io-client";
import NceAlarmService from "./NceAlarmService";
import ObserviumAlarmService from "./ObserviumAlarmService";
import JwtService from "@/core/services/JwtService";
import router from "@/router";
import { ModuleName } from "@/store/enums/module-enum";
import {
  AppNotificationsActions,
  AppNotificationsMutations,
} from "@/store/enums/app-notifications-enum";
import { computed } from "vue";
import { playAlarmSound } from "../helpers/utils";
import NceGponAlarmService from "./NceGponAlarmService";
import { nceGponMutations } from "@/store/enums/nce-gpon-enum";
import NokiaTXNAlarmService from "./NokiaTXNAlarmService";
import { nokiaTXNMutations } from "@/store/enums/nokia-txn-enums";
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "./PermissionsService";
import { ldiSoftswitchEMSMutations } from "@/store/enums/ldi-softswitch-ems-enums";

class SocketIOService {
  socket;
  timeSoundPlay = new Date().getTime();
  private url = process.env.VUE_APP_API_URL || "http://localhost:3000";
  private user = computed(() => {
    return store.getters.currentUser;
  });

  initSocketConnection() {
    this.socket = io(this.url + "?token=" + JwtService.getToken(), {
      transports: ["websocket"],
    }); // Todo will make it secure
    this.onConnection();
    this.onDisconnect();
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  /**
   * EVENTS
   */
  onConnection() {
    this.socket.on("connect", () => {
      console.log("SOCKET CONNECTED !!!");
    });
  }
  onDisconnect() {
    this.socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED !!!");
    });
  }

  async registerWidgetAlarmsListener(type, callback) {
    this.socket.on(type, (data) => {
      callback(data);
    });
  }

  registerNceAlarmsListener() {
    const { SOCKET_EVENTS } = AppConstants;

    if (this.socket.hasListeners(SOCKET_EVENTS.NCE_ALARMS)) {
      console.log(
        `Listener for ${SOCKET_EVENTS.NCE_ALARMS} is already registered.`
      );
      return;
    }

    this.socket.on(SOCKET_EVENTS.NCE_ALARMS, async (data) => {
      const nceTxnPermission = permissions.nce.network;

      if (PermissionsService.hasPermission(nceTxnPermission)) {
        store.dispatch("handleWSNceTxnAlarmEvent", data);

        if (
          store.getters.getCanPlayNceSound &&
          !data?.is_cleared &&
          !store.getters.getIsNCEAlarmsBgModeEnabled
        ) {
          this.playBeepSound(
            AppConstants.NETWORK_TYPE.TRANSMISSION,
            data?.severity?.toLowerCase()
          );
        }
      }
    });
    this.socket.on("new-message", (data) => {
      console.log("new-message", data);
    });
  }

  registerObserviumAlarmsListener() {
    if (this.socket.hasListeners(AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS)) {
      console.log(
        `Listener for ${AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS} is already registered.`
      );
      return;
    }
    this.socket.on(
      AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS,
      async (data) => {
        const ipPermission = permissions.observium.network;
        if (PermissionsService.hasPermission(ipPermission)) {
          store.dispatch("handleWSObserviumAlarmEvent", data);

          if (
            store.getters.getCanPlayObserviumSound &&
            !data?.is_cleared &&
            !store.getters.getIsObserviumAlarmsBgModeEnabled
          ) {
            this.playBeepSound(
              AppConstants.NETWORK_TYPE.IP,
              data?.alert_severity?.toLowerCase()
            );
          }
        }
      }
    );
  }
  emitMessage(message) {
    this.socket.emit("new-message", message);
  }

  registerNceGponAlarmsListener() {
    const { SOCKET_EVENTS } = AppConstants;
    if (this.socket.hasListeners(SOCKET_EVENTS.NCE_GPON_ALARMS)) {
      console.log(
        `Listener for ${SOCKET_EVENTS.NCE_GPON_ALARMS} is already registered.`
      );
      return;
    }

    this.socket.on(SOCKET_EVENTS.NCE_GPON_ALARMS, async (data) => {
      const nceGponPermission = permissions.nceGpon.network;
      if (PermissionsService.hasPermission(nceGponPermission)) {
        store.dispatch("handleWSNceGponAlarmEvent", data);

        if (
          store.getters.getCanPlayNceGponSound &&
          !data?.is_cleared &&
          !store.getters.getIsNceGponAlarmsBgModeEnabled
        ) {
          this.playBeepSound(
            AppConstants.NETWORK_TYPE.GPON,
            data?.severity?.toLowerCase()
          );
        }
      }
    });
    this.socket.on("new-message", (data) => {
      console.log("new-message", data);
    });
  }

  registerNokiaTXNAlarmsListener() {
    const { SOCKET_EVENTS } = AppConstants;
    if (this.socket.hasListeners(SOCKET_EVENTS.NOKIA_TXN_ALARMS)) {
      console.log(
        `Listener for ${SOCKET_EVENTS.NOKIA_TXN_ALARMS} is already registered.`
      );
      return;
    }

    this.socket.on(SOCKET_EVENTS.NOKIA_TXN_ALARMS, async (data) => {
      const nokiaTXNPermission = permissions.nokiaTXN.network;
      if (PermissionsService.hasPermission(nokiaTXNPermission)) {
        store.dispatch("handleWSNokiaTxnAlarmEvent", data);

        if (
          store.getters.getCanPlayNokiaTXNSound &&
          !data?.is_cleared &&
          !store.getters.getIsNokiaTxnAlarmsBgModeEnabled
        ) {
          this.playBeepSound(
            AppConstants.NETWORK_TYPE.TRANSMISSION,
            data?.severity?.toLowerCase()
          );
        }
      }
    });
    this.socket.on("new-message", (data) => {
      console.log("new-message", data);
    });
  }

  registerLDISoftswitchEMSAlarmsListener() {
    const { SOCKET_EVENTS } = AppConstants;
    if (this.socket.hasListeners(SOCKET_EVENTS.LDI_SOFTSWITCH_EMS_ALARMS)) {
      console.log(
        `Listener for ${SOCKET_EVENTS.LDI_SOFTSWITCH_EMS_ALARMS} is already registered.`
      );
      return;
    }

    this.socket.on(SOCKET_EVENTS.LDI_SOFTSWITCH_EMS_ALARMS, async (data) => {
      const ldiSoftswitchEMSPermission = permissions.ldiSoftswitchEMS.network;
      if (PermissionsService.hasPermission(ldiSoftswitchEMSPermission)) {
        store.dispatch("handleWSLDISoftswitchEMSAlarmEvent", data);

        if (
          store.getters.getCanPlayLDISoftswitchEMSSound &&
          !data?.is_cleared &&
          !store.getters.getLDISoftswitchAlarmsEMSBgModeEnabled
        ) {
          this.playBeepSound(
            AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH,
            data?.severity?.toLowerCase()
          );
        }
      }
    });
    this.socket.on("new-message", (data) => {
      console.log("new-message", data);
    });
  }

  /**
   * @description Start Listening dashboard-refresh events
   * @param networkType
   * @param appType
   */
  registerDashboardRefreshListenerNetworkWise(networkType, appType?: string) {
    switch (networkType) {
      case AppConstants.NETWORK_TYPE.IP:
        this.socket.on(AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_IP, () => {
          store.commit(
            observiumMutations.SET_OBSERVIUM_DASHBOARD_REFRESH_COUNT
          );
        });
        break;

      case AppConstants.NETWORK_TYPE.TRANSMISSION:
        switch (appType) {
          case AppConstants.APP_TYPE.NCE:
            this.socket.on(
              AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_TRANSMISSION,
              () => store.commit(nceMutations.SET_NCE_DASHBOARD_REFRESH_COUNT)
            );
            break;

          case AppConstants.APP_TYPE.NOKIA_TXN:
            this.socket.on(
              AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_NOKIA_TXN,
              () =>
                store.commit(
                  nokiaTXNMutations.SET_NOKIA_TXN_DASHBOARD_REFRESH_COUNT
                )
            );
            break;

          default:
            console.log(
              `Unsupported appType '${appType}' for TRANSMISSION network type`
            );
        }
        break;

      case AppConstants.NETWORK_TYPE.GPON:
        this.socket.on(
          AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_GPON,
          () => {
            store.commit(nceGponMutations.SET_NCE_GPON_DASHBOARD_REFRESH_COUNT);
          }
        );
        break;

      case AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH:
        this.socket.on(
          AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_LDI_SOFTSWITCH_EMS,
          () => {
            store.commit(
              ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_DASHBOARD_REFRESH_COUNT
            );
          }
        );
        break;

      default:
        console.log(`Unsupported networkType '${networkType}'`);
    }
  }

  /**
   * @description STOP listening the events
   * @param networkType
   * @param appType
   */
  unRegisterDashboardRefreshListener(networkType, appType?: string) {
    switch (networkType) {
      case AppConstants.NETWORK_TYPE.IP:
        this.socket.off(AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_IP);
        break;

      case AppConstants.NETWORK_TYPE.TRANSMISSION:
        switch (appType) {
          case AppConstants.APP_TYPE.NCE:
            this.socket.off(
              AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_TRANSMISSION
            );
            break;

          case AppConstants.APP_TYPE.NOKIA_TXN:
            this.socket.off(
              AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_NOKIA_TXN
            );
            break;

          default:
            console.warn(
              `Unsupported appType '${appType}' for TRANSMISSION network type`
            );
        }
        break;

      case AppConstants.NETWORK_TYPE.GPON:
        this.socket.off(AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_GPON);
        break;

      case AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH:
        this.socket.off(
          AppConstants.SOCKET_EVENTS.REFRESH_DASHBOARD_LDI_SOFTSWITCH_EMS
        );
        break;

      default:
        console.warn(`Unsupported networkType '${networkType}'`);
    }
  }

  /**
   * @description Listen webapp-update event-messages and route to app-update in case received any broadcasted message
   *              this is to prevent user to stay on outdated page even if they hit no action/link
   */
  registerWebappUpdatEventListener() {
    this.socket.on(AppConstants.SOCKET_EVENTS.WEBAPP_UPDATE, (data) => {
      console.log("webapp-update-event", data);
      router.push({
        name: "app-update",
        query: { redirect: ROUTES.DASHBOARD.INDEX },
      });
    });
  }
  unRegisterWebappUpdateEventListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.WEBAPP_UPDATE);
  }

  registerNotificationListener() {
    this.socket.on(
      AppConstants.SOCKET_EVENTS.TROUBLE_TICKET_NOTIFICATION,
      (data) => {
        if (data?.user_id == this.user.value?.id) {
          store.commit(
            `${ModuleName.appNotifications}/${AppNotificationsMutations.SET_TROUBLE_TICKET_NOTIFICATIONS_DATA_FROM_SOCKET}`,
            data
          );
          // Desktop Notifications only work on Https
          const notification = new Notification(data?.title, {
            body: data?.message,
            icon: "https://www.pinclipart.com/picdir/big/447-4471406_nucleus-png-394757-clipart.png",
          });
          notification.onclick = (event) => {
            event.preventDefault();
            notification.close();
            if (data.link) {
              window.open(data.link, "_blank");
              store.dispatch(
                `${ModuleName.appNotifications}/${AppNotificationsActions.MARK_SEEN_BY_ID}`,
                data.id
              );
            }
          };
        }
      }
    );
  }

  unRegisterNotificationListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.TROUBLE_TICKET_NOTIFICATION);
  }

  unRegisterNceAlarmsListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.NCE_ALARMS);
  }
  unRegisterObserviumAlarmsListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS);
  }
  unRegisterNceGponAlarmsListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.NCE_GPON_ALARMS);
  }
  unRegisterNokiaTxnAlarmsListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.NOKIA_TXN_ALARMS);
  }
  unRegisterLDISoftswitchEMSAlarmsListener() {
    this.socket.off(AppConstants.SOCKET_EVENTS.LDI_SOFTSWITCH_EMS_ALARMS);
  }

  /**
   * @description Playing alarm notification sounds and throttling playingSound in a specific timewindow as well
   * @param networkType
   * @param severity
   */
  async playBeepSound(networkType: string, severity: string) {
    const now = new Date().getTime();
    // Handle Throttling of Playing Sound
    if (now - this.timeSoundPlay >= ALARM_CONFIG.playing_sound_timewindow_ms) {
      await playAlarmSound(networkType, severity);
      this.timeSoundPlay = now;
    }
  }
  /**
   * @description Unregister all connected listeners from all socket events
   */
  removeAllListeners() {
    this.socket.removeAllListeners();
  }
}

export default new SocketIOService();
