<template>
  <!--begin::details View-->
  <div class="card mb-5 mb-xl-10" id="kt_profile_details_view">
    <!--begin::Card header-->
    <div class="card-header cursor-pointer">
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Profile Details</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Action-->
      <router-link
        to="/account/settings"
        class="btn btn-primary align-self-center"
        >Edit Profile</router-link
      >
      <!--end::Action-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body p-9">
      <!--begin::Row-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Full Name</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8">
          <span class="fw-semobold fs-6 text-dark">{{ user.full_name }}</span>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Row-->

      <!--begin::Row-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Username</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8">
          <span class="fw-semobold fs-6 text-dark">{{ user.username }}</span>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Row-->

      <!--begin::Input group-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Department</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 fv-row">
          <span class="fw-semobold fs-6">{{ user.department }}</span>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Sub Deparment</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8">
          {{ user.sub_department }}
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">
          Contact Phone (Official)
        </label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <span class="fw-semobold fs-6 me-2">{{ user.official_mobile }}</span>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">
          Contact Phone (Personal)
        </label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <span class="fw-semobold fs-6 me-2">{{ user.personal_mobile }}</span>
        </div>
        <!--end::Col-->
      </div>

      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted"> Email </label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <span class="fw-semobold fs-6 me-2">{{ user.email }}</span>
        </div>
        <!--end::Col-->
      </div>

      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">
          Email Notifications
          <el-tooltip content="Enable to receive email notifications"
            ><i class="fas fa-exclamation-circle ms-1 fs-7"></i></el-tooltip
        ></label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <el-switch
            class="col-6"
            :size="'small'"
            v-model="userNotificationSettings.receive_email"
            :style="'--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'"
          />
        </div>
        <!--end::Col-->
      </div>

      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">
          Web Notifications
          <el-tooltip content="Enable to receive notifications"
            ><i class="fas fa-exclamation-circle ms-1 fs-7"></i></el-tooltip
        ></label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <el-switch
            class="col-6"
            :size="'small'"
            v-model="userNotificationSettings.receive_notification"
            :style="'--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'"
          />
        </div>
        <!--end::Col-->
      </div>

      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">
          SMS Notifications
          <el-tooltip content="Enable to receive SMS notifications"
            ><i class="fas fa-exclamation-circle ms-1 fs-7"></i></el-tooltip
        ></label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8 d-flex align-items-center">
          <el-switch
            class="col-6"
            :size="'small'"
            v-model="userNotificationSettings.receive_sms"
            :style="'--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'"
          />
        </div>
        <!--end::Col-->
      </div>

      <!--begin::Input group-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Assigned Roles</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8">
          <div class="d-flex">
            <template v-for="roles in user.roles" :key="roles">
              <span class="badge badge-info me-2">{{ roles.name }}</span>
            </template>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="row mb-7">
        <!--begin::Label-->
        <label class="col-lg-4 fw-bold text-muted">Regions</label>
        <!--end::Label-->

        <!--begin::Col-->
        <div class="col-lg-8">
          <div class="d-flex">
            <template v-for="region in user.regions" :key="region">
              <span v-html="RegionBadge(region.name)" class="pe-2"> </span>
            </template>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::details View-->
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { RegionBadge, StatusBadge } from "@/core/helpers/utils";
import ApiService from "@/core/services/ApiService";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { Actions } from "@/store/enums/StoreEnums";
import { USER_SETTING_TYPES } from "@/constants/app-constants";
import GlobalSettingService from "@/core/services/GlobalSettingService";

interface UserNotification {
  receive_email?: boolean;
  receive_sms?: boolean;
  receive_notification?: boolean;
}

export default defineComponent({
  name: "account-overview",
  components: {},
  setup() {
    const isLoading = ref(true);
    const userNotificationSettings = ref<UserNotification>({});
    const store = useStore();
    const user = computed(() => {
      return store.getters.currentUser;
    });

    const getUserNotificationSettings = async () => {
      const res = await GlobalSettingService.getUserGlobalSettings(
        user.value.id
      );

      Object.assign(userNotificationSettings.value, {
        receive_email: res?.data?.receive_email
          ? res?.data?.receive_email == 1
            ? true
            : false
          : true,
        receive_sms: res?.data?.receive_sms
          ? res?.data?.receive_sms == 1
            ? true
            : false
          : true,
        receive_notification: res?.data?.receive_notification
          ? res?.data?.receive_notification == 1
            ? true
            : false
          : true,
      });
      return true;
    };

    const notificationsSettingUpdate = async (type, payload) => {
      const res = await GlobalSettingService.updateUserGlobalSettings(
        user.value.id,
        type,
        payload
      );
      ElNotificationSuccess(res.data?.message);
    };

    onMounted(async () => {
      await getUserNotificationSettings();
      isLoading.value = false;
    });

    watch(
      () => userNotificationSettings.value.receive_email,
      (val) => {
        if (!isLoading.value) {
          notificationsSettingUpdate(USER_SETTING_TYPES.RECEIVE_EMAIL, {
            value: val,
          });
        }
      }
    );

    watch(
      () => userNotificationSettings.value.receive_notification,
      (val) => {
        if (!isLoading.value) {
          notificationsSettingUpdate(USER_SETTING_TYPES.RECEIVE_NOTIFICATION, {
            value: val,
          });
        }
      }
    );

    watch(
      () => userNotificationSettings.value.receive_sms,
      (val) => {
        if (!isLoading.value) {
          notificationsSettingUpdate(USER_SETTING_TYPES.RECEIVE_SMS, {
            value: val,
          });
        }
      }
    );
    return {
      user,
      RegionBadge,
      StatusBadge,
      userNotificationSettings,
    };
  },
});
</script>
