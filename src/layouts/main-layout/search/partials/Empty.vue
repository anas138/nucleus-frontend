<template>
  <!--begin::Empty-->
  <div class="text-center" v-if="isReportModule">
    <!--begin::Icon-->
    <div class="pt-10 pb-10">
      <span class="svg-icon svg-icon-4x opacity-100">
        <img
          :class="displayForCard ? 'h-lg-150px' : 'h-lg-300px '"
          class="mx-auto h-150px theme-light-show"
          :src="$emptyDataImageUrl"
          alt=""
        />
        <img
          :class="displayForCard ? 'h-lg-150px' : 'h-lg-300px '"
          class="mx-auto h-150px theme-dark-show"
          src="/media/illustrations/sigma-1/21-dark.png"
          alt=""
        />
      </span>
    </div>
    <!--end::Icon-->

    <!--begin::Message-->
    <div class="pb-15 fw-semobold">
      <h3 class="text-gray-600 fs-5 mb-2">
        {{
          isDateSelected
            ? `No result found`
            : `You must select date range from filters to load reports`
        }}
      </h3>
      <div class="text-muted fs-7" v-if="isDateSelected">
        Try again with a different query
      </div>
    </div>
    <!--end::Message-->
  </div>

  <div class="text-center" v-else>
    <!--begin::Icon-->
    <div class="pt-10 pb-10">
      <span class="svg-icon svg-icon-4x opacity-100">
        <img
          :class="displayForCard ? 'h-lg-150px' : 'h-lg-300px '"
          class="mx-auto h-150px theme-light-show"
          :src="$emptyDataImageUrl"
          alt=""
        />
        <img
          :class="displayForCard ? 'h-lg-150px' : 'h-lg-300px '"
          class="mx-auto h-150px theme-dark-show"
          src="/media/illustrations/sigma-1/21-dark.png"
          alt=""
        />
      </span>
    </div>
    <!--end::Icon-->

    <!--begin::Message-->
    <div class="pb-15 fw-semobold">
      <h3 class="text-gray-600 fs-5 mb-2">No result found</h3>
      <div class="text-muted fs-7" v-if="!displayForCard">
        Try again with a different query
      </div>
    </div>
    <!--end::Message-->
  </div>
  <!--end::Empty-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "kt-empty",
  components: {},
  props: {
    displayForCard: { type: Boolean, required: false, default: false },
    isReportModule: { type: Boolean, required: false, default: false },
    isDateSelected: { type: Boolean, required: false, default: false },
  },
});
</script>
