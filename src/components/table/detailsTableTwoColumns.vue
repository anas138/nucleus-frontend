<template>
  <div class="d-flex flex-wrap overflow-auto">
    <div class="flex-equal me-5">
      <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
        <tr v-for="(item, index) in data" :key="index">
          <div v-if="index % 2 === 0">
            <td class="text-gray-600 min-w-150px w-150px text-break">
              {{ item.label }}
            </td>
            <td
              class="text-gray-800 min-w-200px text-break"
              v-html="item.value"
            ></td>
          </div>
        </tr>
      </table>
    </div>

    <!--begin::Row-->
    <div class="flex-equal">
      <!--begin::Details-->
      <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
        <tr v-for="(item, index) in data" :key="index">
          <div v-if="index % 2 === 1">
            <td class="text-gray-600 min-w-150px w-150px text-break">
              {{ item.label }}
            </td>
            <td
              class="text-gray-800 min-w-200px text-break"
              v-html="item.value"
            ></td>
          </div>
        </tr>
      </table>
      <!--end::Details-->
    </div>
    <!--end::Row-->
  </div>
</template>

<script lang="ts">
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
