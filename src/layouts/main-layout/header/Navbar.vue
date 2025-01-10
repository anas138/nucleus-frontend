<template>
  <!--begin::Navbar-->
  <div class="app-navbar flex-shrink-0">
    <!--begin::Search-->
    <div class="app-navbar-item align-items-stretch ms-1 ms-lg-3">
      <!-- <KTSearch /> -->
    </div>
    <!--end::Search-->
    <!--begin::Activities-->
    <div class="app-navbar-item ms-1 ms-lg-3">
      <!-- <div
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
        id="kt_activities_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/media/icons/duotune/general/gen032.svg" />
        </span>
      </div> -->
    </div>
    <!--end::Activities-->

    <!--begin::Theme mode-->
    <div class="app-navbar-item ms-1 ms-lg-3">
      <!--begin::Menu toggle-->
      <a
        href="#"
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <span
          v-if="themeMode === 'light'"
          class="svg-icon theme-dark-hide svg-icon-2"
        >
          <inline-svg src="/media/icons/duotune/general/gen060.svg" />
        </span>
        <span v-else class="svg-icon theme-light-hide svg-icon-2">
          <inline-svg src="/media/icons/duotune/general/gen061.svg" />
        </span>
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher />
    </div>
    <!--end::Theme mode-->
    <!--begin::Notifications menu-->
    <div
      class="app-navbar-item ms-1 me-lg-1 me-3"
      id="kt_header_user_menu_toggle"
    >
      <!--begin::Menu wrapper-->
      <div
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <!-- @click="clearTotalAlarmsCount" -->
        <el-badge
          :value="unSeenAlarmNotificationCount"
          :max="99"
          class="item"
          :type="'primary'"
          :hidden="unSeenAlarmNotificationCount > 0 ? false : true"
          title="Incoming Background Critical Alarms"
        >
          <span class="bi-exclamation-octagon-fill text-danger fs-3"> </span>
        </el-badge>
      </div>
      <AlarmsNotificationsSubmenu />
      <!--end::Menu wrapper-->
    </div>
    <!--end::Notifications menu-->
    <!--begin::Notifications menu-->
    <div class="app-navbar-item me-lg-3 me-5" id="kt_header_user_menu_toggle">
      <!--begin::Menu wrapper-->
      <div
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        @click="markAllSeen"
      >
        <el-badge
          :value="unSeenCount"
          :max="99"
          class="item"
          :type="'primary'"
          :hidden="unSeenCount > 0 ? false : true"
        >
          <span class="svg-icon svg-icon-1">
            <inline-svg src="/media/icons/duotune/general/gen007.svg" />
          </span>
        </el-badge>
      </div>
      <KTNotificationMenu />
      <!--end::Menu wrapper-->
    </div>
    <!--end::Notifications menu-->
    <!--begin::User menu-->
    <div class="app-navbar-item ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
      <!--begin::Menu wrapper-->
      <div
        class="cursor-pointer symbol symbol-35px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <ProfileImage :imageUrl="profile_picture" alt="user" />
        <img
          src="/media/logos/ms-logo.png"
          alt="Microsoft Logo"
          class="ms-logo"
          v-if="isMsLoggedIn"
        />
      </div>
      <KTUserMenu />
      <!--end::Menu wrapper-->
    </div>
    <!--end::User menu-->
    <!--begin::User menu-->
    <UserInfo />
    <!--end::User menu-->
    <!--begin::Header menu toggle-->
    <div class="app-navbar-item d-lg-none ms-2 me-n3" title="Show header menu">
      <div
        class="btn btn-icon btn-active-color-primary w-35px h-35px"
        id="kt_app_header_menu_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/media/icons/duotune/text/txt001.svg" />
        </span>
      </div>
    </div>
    <!--end::Header menu toggle-->
  </div>
  <!--end::Navbar-->
</template>

<script>
import { defineComponent, computed } from "vue";
import KTNotificationMenu from "@/layouts/main-layout/menus/NotificationsMenu.vue";
import KTUserMenu from "@/layouts/main-layout/menus/UserAccountMenu.vue";
import KTThemeModeSwitcher from "@/layouts/main-layout/theme-mode/ThemeModeSwitcher.vue";
import { useStore } from "vuex";
import ProfileImage from "@/components/shared/ProfileImage.vue";
import { ModuleName } from "@/store/enums/module-enum";
import {
  AppNotificationsActions,
  AppNotificationsMutations,
} from "@/store/enums/app-notifications-enum";
import UserInfo from "@/layouts/main-layout/menus/UserInfo.vue";
import msalAuthService from "@/core/services/msalAuthService";
import AlarmsNotificationsSubmenu from "../menus/AlarmsNotificationsSubmenu.vue";

export default defineComponent({
  name: "header-navbar",
  components: {
    KTNotificationMenu,
    KTUserMenu,
    KTThemeModeSwitcher,
    ProfileImage,
    UserInfo,
    AlarmsNotificationsSubmenu,
  },
  setup() {
    const store = useStore();
    const profile_picture = computed(() => {
      return store.getters.currentUser.profile_picture;
    });

    const isMsLoggedIn = computed(() => msalAuthService.isUserLoggedIn());

    const unSeenCount = computed(
      () => store.getters[`${ModuleName.appNotifications}/getUnSeenCount`]
    );
    const unSeenAlarmNotificationCount = computed(
      () =>
        store.getters[
          `${ModuleName.appNotifications}/getAlarmNotificationCount`
        ]
    );

    const themeMode = computed(() => {
      return store.getters.getThemeMode;
    });

    const markAllSeen = async () => {
      await store.dispatch(
        `${ModuleName.appNotifications}/${AppNotificationsActions.MARK_ALL_SEEN}`
      );
    };

    const clearTotalAlarmsCount = () => {
      store.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.CLEAR_ALARM_NOTIFICATION_COUNTS}`
      );
    };

    return {
      themeMode,
      markAllSeen,
      clearTotalAlarmsCount,
      unSeenCount,
      unSeenAlarmNotificationCount,
      isMsLoggedIn,
      profile_picture,
    };
  },
});
</script>
<style scoped>
.ms-logo {
  position: absolute;
  height: 16px !important;
  width: 16px !important;
  bottom: -6px;
  right: -6px;
  background: #000;
}
</style>
