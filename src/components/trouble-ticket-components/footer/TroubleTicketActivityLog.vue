<template>
  <CustomSpinner title="Please wait, loading Activity Logs" v-if="isLoading" />
  <div class="card card-bordered" v-else>
    <div class="card-header bg-primary">
      <div class="card-title text-white">Activity logs</div>
    </div>
    <div class="card-body">
      <p v-if="troubleTicketInfo">
        Following are the activity logs that captured during the life cycle of
        ticket
        <b>{{ troubleTicketInfo.ticket_number }}</b> for Alarm
        <b
          >({{
            troubleTicketInfo?.alarm_detail?.native_probable_cause
              ? troubleTicketInfo.alarm_detail?.native_probable_cause
              : troubleTicketInfo?.alarm_detail?.device_hostname
              ? troubleTicketInfo?.alarm_detail?.device_hostname
              : ""
          }})</b
        >.
      </p>
      <div class="block">
        <el-timeline
          v-if="troubleTicketInfo"
          class="stages__timeline custom-scroller"
        >
          <el-timeline-item
            v-for="element in activityLogs"
            :key="element.id"
            placement="bottom"
            type="success"
            size="large"
            icon="el-icon-success"
          >
            <template #dot>
              <ProfileImage
                :imageUrl="element?.user?.profile_picture"
                class="rounded-circle"
                height="30"
                width="30"
                alt=""
                style="margin-left: -11px"
              />
            </template>
            <template #default>
              <div class="row mt-2">
                <div class="col-12">
                  <div
                    class="card card-bordered border-primary stages__timeline-card"
                  >
                    <div class="p-2">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                          <i
                            class="fa fa-check-circle me-2 text-success"
                            aria-hidden="true"
                          ></i>
                          <span v-html="element?.message"></span>
                        </div>
                      </div>
                      <div class="px-2 d-flex justify-content-between">
                        <div v-if="element?.user">
                          <span class="fst-italic">Performed by </span>
                          <UserInfoCard :user-info="element?.user" />
                          <span class="text-muted me-2">|</span>
                          <span class="fst-italic text-muted">{{
                            element?.user?.sub_department?.name
                              ? element?.user?.sub_department?.name
                              : element?.user?.department?.name
                          }}</span>
                        </div>
                        <div v-else></div>
                        <div>
                          <span class="fst-italic stages__timeline-time">
                            <i class="fa fa-clock me-2"></i>
                            {{ $format.datetimeFormat(element?.created_at) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ModuleName } from "@/store/enums/module-enum";
import { computed, defineComponent, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import ProfileImage from "@/components/shared/ProfileImage.vue";
import { troubleTicketActions } from "@/store/enums/trouble-ticket-enum";
import CustomSpinner from "@/components/shared/CustomSpinner.vue";
import UserInfoCard from "@/components/shared/UserInfoCard.vue";

export default defineComponent({
  components: { ProfileImage, CustomSpinner, UserInfoCard },
  props: {},
  setup(props) {
    const store = useStore();
    const isLoading = ref(true);

    const troubleTicketInfo = computed(() => {
      const res = store.getters[`${ModuleName.troubleTicket}/getTicketData`];
      return {
        id: res?.id,
        ticket_number: res?.ticket_number,
        alarm_detail: res?.alarm_detail,
      };
    });

    const activityLogs = computed(() => {
      return store.getters[`${ModuleName.troubleTicket}/getActivityLog`];
    });

    onMounted(async () => {
      await store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_ACTIVITY_LOGS}`,
        troubleTicketInfo.value?.id
      );
      isLoading.value = false;
    });

    return {
      isLoading,
      troubleTicketInfo,
      activityLogs,
    };
  },
});
</script>

<style scoped>
.stages__timeline {
  max-height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.stages__timeline {
  max-height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.stages__timeline-title {
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 1px;
}
.stages__timeline-card {
  border-radius: 22px !important;
  margin-right: 4px;
}
.stages__timeline-time {
  font-size: 0.8rem;
}
.lead__poc {
  display: flex;
  padding: 0.8rem;
  border-radius: 22px;
  background-color: var(--light);
  align-items: center;
  margin-bottom: 1rem;
}
.lead__poc span {
  font-size: 14px;
}
</style>
