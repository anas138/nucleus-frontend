<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <beta-banner class="position-fixed" />
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="<?php echo $params['wrapperClass']?> p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2 auth__layout-right"
    ></div>
    <!--end::Aside-->
    <copyright />
  </div>
  <!--end::Authentication Layout -->
</template>

<script>
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import Copyright from "./Copyright.vue";
import BetaBanner from "@/components/shared/BetaBanner.vue";

export default defineComponent({
  name: "auth-layout",
  components: { Copyright, BetaBanner },
  setup() {
    const store = useStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.dispatch(Actions.ADD_BODY_CLASSNAME, "app-blank");

      store.dispatch(Actions.ADD_BODY_CLASSNAME, "bg-body");
    });
  },
});
</script>
<style scoped>
.auth__layout-right {
  background-image: url("https://www.liveaction.com/wp-content/uploads/2022/12/bigstock-Network-Monitoring-Concept-Of-310515991.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
