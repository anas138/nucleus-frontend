<template>
  <div class="d-flex justify-content-end">
    <button
      class="btn btn-primary"
      :class="outline && 'btn-outline btn-outline-primary'"
      @click="openConfigModal = true"
      style="position: relative"
    >
      <span class="svg-icon svg-icon-2">
        <i class="bi bi-gear w-10px"></i>
      </span>
      Go To Config
    </button>

    <el-drawer
      v-model="openConfigModal"
      size="70%"
      :close-on-click-modal="true"
    >
      <!-- keep in mind that data will have higher priority over id, 
    and route id  will have a higher priority over prop id -->

      <!-- data > route.id > prop.id -->
      <edit-filter-config
        v-if="(data || id) && !fetchingDataFromServer"
        :app_Type="appType"
        :data="data"
        :id="id"
        :disabled="true"
      />
      <div v-else>
        <el-skeleton v-if="fetchingDataFromServer && !id" animated :rows="20" />
        <span>
          could not find config <br />
          Please create one
        </span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import EditFilterConfig from "@/views/alarm-config/EditFilterConfig.vue";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import { AppConstants } from "@/constants/app-constants";
export default {
  props: {
    appType: {
      type: String,
      required: true,
      validator: function (value) {
        return (
          value === AppConstants.APP_TYPE.NCE ||
          value === AppConstants.APP_TYPE.OBSERVIUM ||
          value === AppConstants.APP_TYPE.NCE_GPON ||
          value === AppConstants.APP_TYPE.NOKIA_TXN ||
          value === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        );
      },
    },
    outline: { type: Boolean, default: false },
    // alarmName: { type: String, required: false, default: "" },
    // severity: { type: String, required: false, default: "" },

    id: { type: Number, required: true },
  },
  emits: ["config-apply"],
  components: { EditFilterConfig },
  setup(props, { emit }) {
    // keep in mind that props.id will have higher priority over alarmName and severity,

    // alarmName && severity > prop.id
    const openConfigModal = ref(false);
    const data = ref();
    const fetchingDataFromServer = ref(false);

    // watch(openConfigModal, async () => {
    //   if (!props.id && openConfigModal.value) {
    //     fetchingDataFromServer.value = true;
    //     data.value =
    //       props.alarmName &&
    //       props.severity &&
    //       (await AlarmConfigService.getAlarmsConfigByNameAndSeverity(
    //         props.alarmName,
    //         props.severity,
    //         props.appType
    //       ));
    //     fetchingDataFromServer.value = false;
    //   }
    // });

    return {
      openConfigModal,
      data,
      fetchingDataFromServer,
    };
  },
};
</script>
