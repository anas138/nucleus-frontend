<script lang="ts">
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "@/core/services/PermissionsService";
import SocketIoService from "@/core/services/SocketIoService";
import store from "@/store";
import { isEqual } from "lodash";
import { defineComponent, onUnmounted, watch } from "vue";

/**
 * Background Alarms Events Notifications Handler COmponent
 */
export default defineComponent({
  setup() {
    const registerBackgroundListenersByNetworkPermission = () => {
      if (PermissionsService.hasPermission(permissions.nce.network)) {
        SocketIoService.registerNceAlarmsListener();
      } else {
        SocketIoService.unRegisterNceAlarmsListener();
      }
      if (PermissionsService.hasPermission(permissions.observium.network)) {
        SocketIoService.registerObserviumAlarmsListener();
      } else {
        SocketIoService.unRegisterObserviumAlarmsListener();
      }
      if (PermissionsService.hasPermission(permissions.nceGpon.network)) {
        SocketIoService.registerNceGponAlarmsListener();
      } else {
        SocketIoService.unRegisterNceGponAlarmsListener();
      }
      if (PermissionsService.hasPermission(permissions.nokiaTXN.network)) {
        SocketIoService.registerNokiaTXNAlarmsListener();
      } else {
        SocketIoService.unRegisterNokiaTxnAlarmsListener();
      }
      if (
        PermissionsService.hasPermission(permissions.ldiSoftswitchEMS.network)
      ) {
        SocketIoService.registerLDISoftswitchEMSAlarmsListener();
      } else {
        SocketIoService.unRegisterLDISoftswitchEMSAlarmsListener();
      }
    };
    onUnmounted(() => {
      SocketIoService.removeAllListeners();
    });

    watch(
      () => store.getters.getPermissions,
      (newVal, oldVal) => {
        // On Change in permissions state in 'AuthModule' store, need to Register or Unsubscribe Specific Event-Listeners
        if (!isEqual(newVal, oldVal)) {
          registerBackgroundListenersByNetworkPermission();
        }
      },
      { immediate: true }
    );
  },
});
</script>
