<template>
  <div class="card mt-3">
    <!--begin::Toolbar-->
    <div
      id="kt_app_toolbar"
      class="app-toolbar card-header border-bottom"
      v-if="showAppToolbar && !isLoading"
    >
      <!--begin::Toolbar container-->
      <div class="d-flex flex-stack w-100">
        <KTPageTitle
          :pageIconToDisplay="pageIcon"
          :pageTitleToDisplay="pageTitle"
          :pageTitleFutherInfo="pageTitleFutherInfo"
          v-if="!editPageTitle"
        />
        <!--begin::Actions-->
        <div class="d-flex align-items-center flex-stack gap-2 gap-lg-3">
          <slot name="title-help"></slot>
          <!-- todo: dynamic tempalte will go here.... //-->
          <!--begin::Secondary button-->
          <slot name="actions"></slot>
          <!--end::Primary button-->
        </div>
        <!--end::Actions-->
      </div>
      <!--end::Toolbar container-->
    </div>
    <!--end::Toolbar-->
    <!-- custom header -->
    <div v-else-if="customHeader && !isLoading">
      <slot name="custom-header"></slot>
    </div>
    <!-- custom header -->
    <div class="flex-column-fluid card-body pt-2">
      <div v-if="!isLoading"><slot name="body"></slot></div>
      <div class="card loader-card" v-else>
        <div class="card-body d-flex align-items-center justify-content-center">
          <div class="custom__spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <span class="custom__spinner-text">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted } from "vue";
import { toolbarWidthFluid } from "@/core/helpers/config";
import KTPageTitle from "@/layouts/main-layout/toolbar/PageTitle.vue";

export default defineComponent({
  components: {
    KTPageTitle,
  },
  props: {
    isLoading: { type: Boolean, default: false },
    pageIcon: {
      type: String,
      required: false,
      default: "",
    },
    pageTitle: {
      type: String,
      required: false,
      default: "",
    },
    pageTitleFutherInfo: {
      type: String,
      required: false,
      default: "",
    },
    editPageTitle: {
      type: Boolean,
      required: false,
      default: false,
    },
    showAppToolbar: {
      type: Boolean,
      default: true,
    },
    customHeader: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      toolbarWidthFluid,
    };
  },
});
</script>

<style scoped>
.custom__spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.custom__spinner-text {
  font-size: 1.2rem;
  letter-spacing: 2px;
  padding: 10px;
}

.loader-card {
  height: calc(70vh);
}
</style>
