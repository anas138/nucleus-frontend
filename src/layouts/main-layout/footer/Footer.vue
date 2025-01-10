<template>
  <!--begin::Footer-->
  <div v-if="footerDisplay" id="kt_app_footer" class="app-footer">
    <!--begin::Footer container-->
    <div
      class="app-container d-flex flex-column flex-md-row flex-center flex-md-stack py-3"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <!--begin::Copyright-->
      <div class="footer-left">
        <span class="text-muted fw-semibold me-1"
          >{{ new Date().getFullYear() }}©</span
        >
        <a
          href=""
          target="_blank"
          class="text-gray-800 text-hover-primary fw-bold"
          >{{ appName }}</a
        >
      </div>
      <!--end::Copyright-->

      <div class="footer-right text-primary">version {{ version }}</div>
    </div>
    <!--end::Footer container-->
  </div>
  <!--end::Footer-->
</template>

<script>
import { defineComponent } from "vue";
import { footerWidthFluid, footerDisplay } from "@/core/helpers/config";
import { version, appName } from "@/core/helpers/documentation";

export default defineComponent({
  name: "theme-footer",
  components: {},
  setup() {
    return {
      appName,
      version,
      footerWidthFluid,
      footerDisplay,
    };
  },
});
</script>

<style scoped>
.footer-left {
  flex: 1; /* Occupy available space on the left */
}

.footer-right {
  text-align: right; /* Align content to the right */
}
</style>
