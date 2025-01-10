<template>
  <!--begin::Menu-->

  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-300px w-sm-450px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div class="d-flex flex-column bgi-no-repeat rounded-top py-3">
      <template
        v-if="
          nceTxnAlarmsCount +
            observiumAlarmsCount +
            nceGponAlarmsCount +
            nokiaTxnAlarmsCount +
            ldiSoftswitchEMSAlarmsCount >
          0
        "
      >
        <div class="menu-item border-bottom">
          <div
            class="d-flex p-2 justify-content-between align-items-center mx-2"
          >
            <h5 class="">Critical Alarms</h5>
            <span
              class="text-wrap clear_all-text text-underline"
              @click="clearAllAlarmsNotificationAndCounts"
              >Clear All</span
            >
          </div>
        </div>
        <div class="mh-300px overflow-auto">
          <div class="filters__list-item" v-if="nceTxnAlarmsCount > 0">
            <div class="menu-item p-0" @click="onClickNceTxnNotification">
              <div
                class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
              >
                <div class="d-flex flex-stack">
                  <span>
                    {{ listItemText }}
                    <span class="fw-bold text-primary">{{
                      $ncePresentationName
                    }}</span>
                  </span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <span :class="`badge badge-secondary`" class="mx-2">{{
                    nceTxnAlarmsCount
                  }}</span>
                  <span
                    class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mh-300px overflow-auto">
          <div class="filters__list-item" v-if="observiumAlarmsCount > 0">
            <div class="menu-item p-0" @click="onClickObservuimNotification">
              <div
                class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
              >
                <div class="d-flex flex-stack">
                  <span>
                    {{ listItemText }}
                    <span class="fw-bold text-primary">{{
                      $observiumPresentationName
                    }}</span>
                  </span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <span :class="`badge badge-secondary`" class="mx-2">{{
                    observiumAlarmsCount
                  }}</span>
                  <span
                    class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mh-300px overflow-auto">
          <div class="filters__list-item" v-if="nceGponAlarmsCount > 0">
            <div class="menu-item p-0" @click="onClickNceGponNotification">
              <div
                class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
              >
                <div class="d-flex flex-stack">
                  <span>
                    {{ listItemText }}
                    <span class="fw-bold text-primary">{{
                      $nceGponPresentationName
                    }}</span>
                  </span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <span :class="`badge badge-secondary`" class="mx-2">{{
                    nceGponAlarmsCount
                  }}</span>
                  <span
                    class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mh-300px overflow-auto">
          <div class="filters__list-item" v-if="nokiaTxnAlarmsCount > 0">
            <div class="menu-item p-0" @click="onClickNokiaTxnNotification">
              <div
                class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
              >
                <div class="d-flex flex-stack">
                  <span>
                    {{ listItemText }}
                    <span class="fw-bold text-primary">{{
                      $nokiaTXNPresentationName
                    }}</span>
                  </span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <span :class="`badge badge-secondary`" class="mx-2">{{
                    nokiaTxnAlarmsCount
                  }}</span>
                  <span
                    class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mh-300px overflow-auto">
          <div
            class="filters__list-item"
            v-if="ldiSoftswitchEMSAlarmsCount > 0"
          >
            <div
              class="menu-item p-0"
              @click="onClickLDISoftswitchEMSNotification"
            >
              <div
                class="menu-link p-0 d-flex align-items-center justify-content-between mx-6 py-2"
              >
                <div class="d-flex flex-stack">
                  <span>
                    {{ listItemText }}
                    <span class="fw-bold text-primary">{{
                      $LDISoftswitchEMSPresentationName
                    }}</span>
                  </span>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <span :class="`badge badge-secondary`" class="mx-2">{{
                    ldiSoftswitchEMSAlarmsCount
                  }}</span>
                  <span
                    class="bullet bullet-dot bg-primary h-6px w-6px mb-2"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div
        class="py-6 d-flex flex-column justify-content-center align-items-center"
        href="#"
        v-else
      >
        <img class="mx-auto h-100px" :src="$emptyDataImageUrl" alt="" />
        <span>No alarms received in the background yet</span>
      </div>
      <!--end::Menu-->
    </div>
  </div>
</template>

<script lang="ts">
import { ModuleName } from "@/store/enums/module-enum";
import {
  defineComponent,
  onMounted,
  computed,
  onUnmounted,
  watch,
  ref,
} from "vue";
import { useStore } from "vuex";
import {
  playAlarmSound,
  playAlarmSoundBG,
  timeDifferenceFromNow,
} from "@/core/helpers/utils";
import { useRoute, useRouter } from "vue-router";
import { ALARM_CONFIG } from "@/constants/app-constants";
import { AppNotificationsMutations } from "@/store/enums/app-notifications-enum";

export default defineComponent({
  name: "notifications-menu",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const timeSoundPlay = ref(new Date().getTime());
    const nceTxnAlarmsCount = computed(
      () => store.getters.getNceTxnAlarmsCount
    );

    const observiumAlarmsCount = computed(
      () => store.getters.getObserviumAlarmsCount
    );

    const nceGponAlarmsCount = computed(
      () => store.getters.getNceGponAlarmsCount
    );

    const nokiaTxnAlarmsCount = computed(
      () => store.getters.getNokiaTxnAlarmsCount
    );

    const ldiSoftswitchEMSAlarmsCount = computed(
      () => store.getters.getLDISoftswitchEMSAlarmsCount
    );

    const isNCEAlarmsBgModeEnabled = computed(
      () => store.getters.getIsNCEAlarmsBgModeEnabled
    );

    const isObserviumAlarmsBgModeEnabled = computed(
      () => store.getters.getIsObserviumAlarmsBgModeEnabled
    );

    const isNceGponAlarmsBgModeEnabled = computed(
      () => store.getters.getIsNceGponAlarmsBgModeEnabled
    );

    const isNokiaTxnAlarmsBgModeEnabled = computed(
      () => store.getters.getIsNokiaTxnAlarmsBgModeEnabled
    );

    const isLDISoftswitchAlarmsEMSBgModeEnabled = computed(
      () => store.getters.getLDISoftswitchAlarmsEMSBgModeEnabled
    );

    const playBeepSoundBG = async () => {
      const now = new Date().getTime();
      // Handle Throttling of Playing Sound

      if (
        now - timeSoundPlay.value >=
          ALARM_CONFIG.playing_sound_bg_timewindow_ms &&
        isNCEAlarmsBgModeEnabled.value &&
        isObserviumAlarmsBgModeEnabled.value &&
        isNceGponAlarmsBgModeEnabled.value &&
        isNokiaTxnAlarmsBgModeEnabled.value &&
        isLDISoftswitchAlarmsEMSBgModeEnabled.value
      ) {
        await playAlarmSoundBG();
        timeSoundPlay.value = now;
      }
    };

    const unSeenAlarmNotificationCount = computed(
      () =>
        store.getters[
          `${ModuleName.appNotifications}/getAlarmNotificationCount`
        ]
    );

    watch(
      () => unSeenAlarmNotificationCount.value,
      () => {
        playBeepSoundBG();
      }
    );

    const clearNotifications = async () => {
      // To Clear Notification
      store.commit("clearNceTxnAlarmsCount");
      store.commit("clearObserviumAlarmsCount");
      store.commit("clearNceGponAlarmsCount");
      store.commit("clearNokiaTxnAlarmsCount");
      store.commit("clearLDISoftswitchEMSAlarmsCount");
    };

    const clearAllAlarmsNotificationAndCounts = () => {
      store.commit("clearNceTxnAlarmsCount");
      store.commit("clearObserviumAlarmsCount");
      store.commit("clearNceGponAlarmsCount");
      store.commit("clearNokiaTxnAlarmsCount");
      store.commit("clearLDISoftswitchEMSAlarmsCount");
      store.commit(
        `${ModuleName.appNotifications}/${AppNotificationsMutations.CLEAR_ALARM_NOTIFICATION_COUNTS}`
      );
    };

    onUnmounted(() => {
      clearAllAlarmsNotificationAndCounts();
    });

    const onClickNceTxnNotification = () => {
      //To Click Event
      router.push({ name: "nce-alarm-list" });
    };

    const onClickObservuimNotification = () => {
      //To Click Event
      router.push({ name: "observium-alarm-list" });
    };

    const onClickNceGponNotification = () => {
      //To Click Event
      router.push({ name: "nce-gpon-alarm-list" });
    };

    const onClickNokiaTxnNotification = () => {
      //To Click Event
      router.push({ name: "nokia-txn-alarm-list" });
    };

    const onClickLDISoftswitchEMSNotification = () => {
      //To Click Event
      router.push({ name: "ldi-softswitch-alarm-list" });
    };

    return {
      nceTxnAlarmsCount,
      observiumAlarmsCount,
      nceGponAlarmsCount,
      nokiaTxnAlarmsCount,
      ldiSoftswitchEMSAlarmsCount,
      clearNotifications,
      clearAllAlarmsNotificationAndCounts,
      onClickNceTxnNotification,
      onClickObservuimNotification,
      listItemText: "New alarms received for network ",
      onClickNceGponNotification,
      onClickNokiaTxnNotification,
      onClickLDISoftswitchEMSNotification,
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
