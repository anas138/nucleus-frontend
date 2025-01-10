<template>
  <!--begin::Navbar-->
  <div class="card mb-5 mb-xl-10 mt-3">
    <div class="card-body pt-9 pb-0">
      <!--begin::Details-->
      <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
        <!--begin: Pic-->
        <div class="me-7 mb-4">
          <div
            class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
          >
            <ProfileImage :imageUrl="user.profile_picture" alt="image" />
            <!-- <div
              class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"
            ></div> -->
            <img
              src="/media/logos/ms-logo.png"
              alt="Microsoft Logo"
              class="ms-logo"
              v-if="isMsLoggedIn"
            />
          </div>
        </div>
        <!--end::Pic-->

        <!--begin::Info-->
        <div class="flex-grow-1">
          <!--begin::Title-->
          <div
            class="d-flex justify-content-between align-items-start flex-wrap mb-2"
          >
            <!--begin::User-->
            <div class="d-flex flex-column">
              <!--begin::Name-->
              <div class="d-flex align-items-center mb-2">
                <div href="#" class="text-gray-800 fs-2 fw-bold me-1">
                  {{ user.full_name }}
                </div>
                <div href="#">
                  <span class="svg-icon svg-icon-1 svg-icon-primary">
                    <inline-svg src="/media/icons/duotune/general/gen026.svg" />
                  </span>
                </div>
              </div>
              <!--end::Name-->

              <!--begin::Info-->
              <div class="d-flex flex-wrap fw-semobold fs-6 pe-2">
                <div
                  href="#"
                  class="d-flex align-items-center text-gray-400 me-5 mb-2"
                >
                  <span class="svg-icon svg-icon-4 me-1">
                    <inline-svg
                      src="/media/icons/duotune/communication/com006.svg"
                    />
                  </span>
                  {{ user.designation || "No Designation" }}
                </div>
                <div
                  href="#"
                  class="d-flex align-items-center text-gray-400 mb-2"
                >
                  <span class="svg-icon svg-icon-4 me-1">
                    <inline-svg
                      src="/media/icons/duotune/communication/com011.svg"
                    />
                  </span>
                  {{ user.email }}
                </div>
              </div>
              <div
                href="#"
                class="d-flex align-items-center text-gray-400 me-5 mb-2"
              >
                <span class="svg-icon svg-icon-4 me-1">
                  <inline-svg src="/media/svg/categories/department.svg" />
                </span>
                {{ user.department || "No Department" }}
                {{ user.sub_department && `| ${user.sub_department}` }}
              </div>
              <!--end::Info-->
            </div>
            <!--end::User-->
          </div>
          <!--end::Title-->
        </div>
        <!--end::Info-->
      </div>
      <!--end::Details-->

      <!--begin::Navs-->
      <div class="d-flex overflow-auto h-55px">
        <ul
          class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"
        >
          <!--begin::Nav item-->
          <li class="nav-item">
            <router-link
              to="/account/overview"
              class="nav-link text-active-primary me-6"
              active-class="active"
            >
              Overview
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li class="nav-item">
            <router-link
              to="/account/settings"
              class="nav-link text-active-primary me-6"
              active-class="active"
            >
              Settings
            </router-link>
          </li>
          <!--end::Nav item-->
        </ul>
      </div>
      <!--begin::Navs-->
    </div>
  </div>
  <!--end::Navbar-->
  <router-view></router-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import ProfileImage from "@/components/shared/ProfileImage.vue";
import msalAuthService from "@/core/services/msalAuthService";

export default defineComponent({
  name: "kt-account",
  components: {
    ProfileImage,
  },
  setup() {
    const store = useStore();
    const user: any = computed(() => {
      return store.getters.currentUser;
    });

    const isMsLoggedIn = computed(() => msalAuthService.isUserLoggedIn());

    return {
      user,
      isMsLoggedIn,
    };
  },
});
</script>
<style scoped>
.ms-logo {
  position: absolute;
  height: 40px !important;
  width: 40px !important;
  bottom: -16px;
  right: -16px;
  background: #000;
}
</style>
