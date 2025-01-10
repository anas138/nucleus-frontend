<template>
  <el-popover
    :show-after="500"
    placement="top-start"
    trigger="hover"
    width="fit-content"
  >
    <template #reference>
      <span class="cursor-pointer performed__by-title me-2">{{
        userInfo?.full_name
      }}</span>
    </template>
    <div class="d-flex align-items-center">
      <div class="symbol symbol-50px">
        <ProfileImage :imageUrl="userInfo?.profile_picture" alt="user" />
      </div>
      <div class="d-flex flex-column justify-content-center ms-4">
        <span class="text-gray-800 fs-6 fw-bold">{{
          userInfo?.full_name
        }}</span>
        <div class="d-flex align-items-center">
          <span class="text-gray-700 fs-8" v-if="userInfo?.designation?.name">{{
            userInfo?.designation?.name
          }}</span>
          <span
            class="text-gray-700 fs-8 mx-1"
            v-if="userInfo?.designation?.name"
            >|</span
          >
          <span class="text-gray-700 fs-8">{{
            userInfo?.department?.name
          }}</span>
          <span
            class="text-gray-700 fs-8 mx-1"
            v-if="userInfo?.sub_department?.name"
            >|</span
          >
          <span
            class="text-gray-700 fs-8"
            v-if="userInfo?.sub_department?.name"
            >{{ userInfo?.sub_department?.name }}</span
          >
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ProfileImage from "./ProfileImage.vue";
export default defineComponent({
  components: { ProfileImage },
  props: { userInfo: { type: Object, default: () => ({}) } },
});
</script>
<style scoped>
.performed__by-title {
  color: #5199e2;
}
</style>
