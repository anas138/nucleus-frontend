<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold py-4 fs-6 min-w-275px max-w-350px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-2">
      <div class="menu-content d-flex align-items-center px-1">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <ProfileImage :imageUrl="profile.profile_picture" alt="Logo" />
          <img
            src="/media/logos/ms-logo.png"
            alt="Microsoft Logo"
            class="ms-logo"
            v-if="isMsLoggedIn"
          />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ profile.full_name }}
          </div>
          <span class="fw-semobold text-muted text-wrap fs-7">{{
            profile.designation
          }}</span>
          <span class="fw-semobold text-muted text-wrap fs-7">{{
            profile.department
          }}</span>
          <span class="fw-semobold text-muted text-wrap fs-7">{{
            profile.email
          }}</span>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/account/overview" class="menu-link px-5">
        Account Settings
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Actions } from "@/store/enums/StoreEnums";
import ProfileImage from "@/components/shared/ProfileImage.vue";
import msalAuthService from "@/core/services/msalAuthService";
import { logOutMs } from "@/core/helpers/utils";

export default defineComponent({
  name: "kt-user-menu",
  components: { ProfileImage },
  setup() {
    const router = useRouter();
    const store = useStore();
    const profile = computed(() => {
      return store.getters.currentUser;
    });

    const isMsLoggedIn = computed(() => msalAuthService.isUserLoggedIn());

    const signOut = () => {
      store.dispatch(Actions.LOGOUT).then(() => {
        router.push({ name: "sign-in" }).then(() => {
          logOutMs();
        });
      });
    };

    return {
      signOut,
      profile,
      isMsLoggedIn,
    };
  },
});
</script>
<style scoped>
.ms-logo {
  position: absolute;
  height: 20px !important;
  width: 20px !important;
  bottom: -8px;
  right: -8px;
  background: #000;
}
</style>
