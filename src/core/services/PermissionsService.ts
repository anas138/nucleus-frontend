import store from "@/store";
import _ from "lodash";
import { computed } from "vue";
import ApiService from "./ApiService";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export class PermissionsService {
  private static permissions = computed(() => {
    return store.getters.getPermissions || [];
  });

  public static hasPermission(permissionsToCheckFor) {
    if (permissionsToCheckFor === undefined) return true;
    if (typeof permissionsToCheckFor === "string") {
      if (permissionsToCheckFor === "") return true;
      return this.permissions.value.some(
        (permission) => permission.name === permissionsToCheckFor
      );
    } else if (Array.isArray(permissionsToCheckFor)) {
      if (permissionsToCheckFor.length <= 0) return true;
      return permissionsToCheckFor.some((permissionToCheck) =>
        this.permissions.value.some(
          (permission) => permission.name === permissionToCheck
        )
      );
    }

    return false;
  }

  public static async getAllPermissions() {
    const response = await ApiService.get("/auth", "user/permissions");
    return response.data.data;
  }

  public static async permissionChecker(networkType) {
    switch (networkType) {
      case AppConstants.NETWORK_TYPE.TRANSMISSION:
        return this.hasPermission(permissions.nce.network);
      case AppConstants.NETWORK_TYPE.IP:
        return this.hasPermission(permissions.observium.network);
      default:
        return false;
    }
  }

  public static troubleTicketPermission(troubleTicket, userInfo) {
    return (
      troubleTicket?.assigned_to_id !== userInfo.id &&
      (troubleTicket.sub_department_id === userInfo.sub_department_id ||
        troubleTicket?.createdByUser?.sub_department_id ===
          userInfo?.sub_department_id) &&
      troubleTicket?.currentStatus?.id !==
        TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED &&
      troubleTicket?.currentStatus?.id !==
        TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED &&
      troubleTicket?.currentStatus?.id !==
        TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.PAUSE
    );
  }
}
