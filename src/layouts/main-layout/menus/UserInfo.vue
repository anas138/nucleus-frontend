<template>
  <div class="d-none d-xl-flex flex-column justify-content-center ms-4">
    <span class="text-gray-800 fs-6 fw-bold">{{ userProfile?.full_name }}</span>
    <div class="d-flex align-items-center">
      <el-tooltip
        v-if="userProfile?.designation?.length > HEADER_USER_INFO_LENGTH"
        :content="userProfile?.designation"
      >
        <span class="text-gray-700 fs-8">{{
          `${userProfile?.designation?.slice(0, HEADER_USER_INFO_LENGTH)} ....`
        }}</span>
      </el-tooltip>
      <span class="text-gray-700 fs-8" v-else>{{
        userProfile?.designation
      }}</span>
      <span class="text-gray-700 fs-8 mx-1">|</span>
      <el-tooltip
        v-if="userProfile?.department?.length > HEADER_USER_INFO_LENGTH"
        :content="userProfile?.department"
      >
        <span class="text-gray-700 fs-8">{{
          `${userProfile?.department?.slice(0, HEADER_USER_INFO_LENGTH)} ....`
        }}</span>
      </el-tooltip>
      <span class="text-gray-700 fs-8" v-else>{{
        userProfile?.department
      }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { AppConstants } from "@/constants/app-constants";

export default defineComponent({
  setup() {
    const store = useStore();
    const userProfile = computed(() => {
      const res = store.getters.currentUser;
      return {
        full_name: res?.full_name,
        designation: res?.designation,
        department: res?.department,
      };
    });
    return {
      userProfile,
      HEADER_USER_INFO_LENGTH: AppConstants.HEADER_USER_INFO_LENGTH,
    };
  },
});
</script>
