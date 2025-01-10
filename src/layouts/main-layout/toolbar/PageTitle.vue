<template>
  <!--begin::Page title-->
  <div
    v-if="pageTitleDisplay"
    :class="`page-title d-flex flex-${pageTitleDirection} justify-content-center flex-wrap me-3`"
  >
    <template v-if="pageTitle">
      <!--begin::Title-->
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 justify-content-center my-0 align-items-center"
      >
        <i
          v-if="pageIconToDisplay || pageIcon"
          :class="pageIconToDisplay || pageIcon"
          class="mx-3 fs-3"
        />
        {{ pageTitleToDisplay || pageTitle }}
        <span class="badge badge-info ms-3" v-if="pageTitleFutherInfo">
          {{ pageTitleFutherInfo }}
        </span>
      </h1>
      <!--end::Title-->

      <span
        v-if="pageTitleDirection === 'row' && pageTitleBreadcrumbDisplay"
        class="h-20px border-gray-200 border-start mx-3"
      ></span>

      <!--begin::Breadcrumb-->
      <!-- <ul
        v-if="breadcrumbs && pageTitleBreadcrumbDisplay"
        class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
      >
        <li class="breadcrumb-item text-muted">
          <router-link to="/" class="text-muted text-hover-primary"
            >Home</router-link
          >
        </li>
        <template v-for="(item, i) in breadcrumbs" :key="i">
          <li class="breadcrumb-item">
            <span class="bullet bg-gray-400 w-5px h-2px"></span>
          </li>
          <li class="breadcrumb-item text-muted">{{ item }}</li>
        </template>
      </ul> -->
      <!--end::Breadcrumb-->
    </template>
  </div>
  <div v-else class="align-items-stretch"></div>
  <!--end::Page title-->
</template>

<script>
import { defineComponent, computed } from "vue";
import {
  pageTitleDisplay,
  pageTitleBreadcrumbDisplay,
  pageTitleDirection,
} from "@/core/helpers/config";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "layout-page-title",
  components: {},
  props: {
    pageIconToDisplay: {
      type: String,
      required: false,
      default: "",
    },
    pageTitleToDisplay: {
      type: String,
      required: false,
      default: "",
    },
    pageTitleFutherInfo: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const route = useRoute();

    const pageTitle = computed(() => {
      return route.meta.pageTitle;
    });
    const pageIcon = computed(() => {
      return route.meta.pageIcon;
    });

    const breadcrumbs = computed(() => {
      return route.meta.breadcrumbs;
    });

    return {
      pageTitle,
      pageIcon,
      breadcrumbs,
      pageTitleDisplay,
      pageTitleBreadcrumbDisplay,
      pageTitleDirection,
    };
  },
});
</script>
