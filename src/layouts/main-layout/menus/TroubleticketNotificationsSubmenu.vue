<template>
  <!--begin::Menu-->

  <template v-if="notifications && notifications.length > 0">
    <div class="menu-item">
      <div class="d-flex py-2 px-2 justify-content-end menu-link">
        <span class="text-wrap clear_all-text mx-8" @click="clearNotifications"
          >Clear All</span
        >
      </div>
    </div>
    <div class="mh-300px overflow-auto mb-5">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="filters__list-item"
      >
        <div
          class="menu-item p-0"
          @click="onClickNotification(notification?.id, notification?.route)"
        >
          <div
            class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
          >
            <div>
              <h3 class="fs-7 m-0">
                {{ notification?.title }}
              </h3>
              <span class="fs-7 col-form-label fw-normal m-0">
                {{ notification?.message }}
              </span>
            </div>
            <div
              class="d-flex flex-column justify-content-center align-items-center ms-5"
            >
              <span
                class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                v-if="notification?.is_open == 0"
              ></span>
              <span :class="`badge badge-secondary`">
                {{ timeDifferenceFromNow(notification?.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <CustomSpinner
    class="py-6"
    title="Please wait, loading trouble ticket notifications."
    v-else-if="isLoading"
  />
  <div
    class="py-6 d-flex flex-column justify-content-center align-items-center"
    href="#"
    v-else
  >
    <img class="mx-auto h-100px" :src="$emptyDataImageUrl" alt="" />
    <span>No Messages Yet</span>
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import SocketIoService from "@/core/services/SocketIoService";
import {
  AppNotificationsActions,
  AppNotificationsMutations,
} from "@/store/enums/app-notifications-enum";
import { ModuleName } from "@/store/enums/module-enum";
import { defineComponent, onMounted, computed, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import AppNotificationService from "@/core/services/AppNotificationService";
import { timeDifferenceFromNow } from "@/core/helpers/utils";
import CustomSpinner from "@/components/shared/CustomSpinner.vue";

export default defineComponent({
  name: "notifications-menu",
  components: { CustomSpinner },
  setup() {
    const store = useStore();
    const isLoading = ref<boolean>(true);
    const userId = computed(() => {
      const { id } = store.getters.currentUser;
      return id;
    });
    const notifications = computed(
      () => store.getters[`${ModuleName.appNotifications}/getNotifications`]
    );

    const getNotifications = async () => {
      await store.dispatch(
        `${ModuleName.appNotifications}/${AppNotificationsActions.GET_TROUBLE_TICKET_NOTIFICATIONS}`
      );
      isLoading.value = false;
    };

    onMounted(() => {
      getNotifications();
      SocketIoService.registerNotificationListener();
    });

    onUnmounted(() => {
      SocketIoService.unRegisterNotificationListener();
      store.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.CLEAR_DATA}`
      );
    });

    const clearNotifications = async () => {
      await AppNotificationService.clearAllNotification(userId.value);
      store.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.CLEAR_DATA}`
      );
    };
    const onClickNotification = async (id: number, route: string) => {
      store.dispatch(
        `${ModuleName.appNotifications}/${AppNotificationsActions.MARK_SEEN_BY_ID}`,
        id
      );
      router.push({ path: route });
    };
    return {
      isLoading,
      notifications,
      clearNotifications,
      onClickNotification,
      timeDifferenceFromNow,
    };
  },
});
</script>

<style scoped>
.clear_all-text:hover {
  color: var(--kt-primary);
  cursor: pointer;
}
.filters__list-item:hover h3,
.filters__list-item:hover span {
  color: var(--kt-primary);
  transition: 0.3s;
}

.filters__list-item:hover {
  background-color: var(--kt-light);
  cursor: pointer;
  transition: 0.3s;
}
</style>
