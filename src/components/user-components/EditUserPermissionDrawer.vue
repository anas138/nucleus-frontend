<template>
  <el-drawer v-model="openDrawer" :size="'90%'" :close-on-click-modal="true">
    <EditUserPermissions
      :isDrawer="true"
      @close-drawer="() => (openDrawer = false)"
    />
  </el-drawer>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import EditUserPermissions from "@/views/users/EditUserPermissions.vue";

export default defineComponent({
  components: { EditUserPermissions },
  props: {
    openEditUserPermissionDrawer: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:openDrawer"],
  setup(props, { emit }) {
    const openDrawer = ref(false);
    watch(
      () => props.openEditUserPermissionDrawer,
      (val) => {
        openDrawer.value = val;
      }
    );

    watch(
      () => openDrawer.value,
      (val) => {
        emit("update:openDrawer", val);
      }
    );
    return {
      openDrawer,
    };
  },
});
</script>
