<template>
  <thead>
    <tr
      class="text-start text-400 fw-bold fs-7 gs-0"
      :class="headerCapitalize ? `text-capitalize` : `text-uppercase`"
    >
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div
          class="form-check form-check-sm form-check-custom form-check-solid me-3"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="checked"
            @change="selectAll()"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          :class="[
            // 'text-end': i === header.length - 1,
            tableBordered && 'pe-4',
          ]"
          class="text-nowrap"
          @click="onSort(column.key, column.sortEnabled)"
          :style="{
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
            width: 'auto',
            cursor: column.sortEnabled ? 'pointer' : 'auto',
          }"
        >
          <!-- v-html="sortArrow" -->
          <div class="d-flex justify-content-between align-items-center">
            <span class="me-2">
              {{ column.columnLabel || $filters.removeUnderscore(column.key) }}
            </span>
            <span v-if="column.sortEnabled" class="d-flex flex-column me-2">
              <!-- <i class="fa fa-solid fa-sort-up"></i>
              <i class="fa fa-solid fa-sort-down"></i
            > -->
              <i
                class="bi bi-caret-up-fill custom_sort-icon"
                :class="
                  columnLabelAndOrder.key === column.key &&
                  columnLabelAndOrder.order === 'asc' &&
                  'custom_sort-icon-active'
                "
                style="top: 9px"
              ></i>
              <i
                class="bi bi-caret-down-fill custom_sort-icon"
                :class="
                  columnLabelAndOrder.key === column.key &&
                  columnLabelAndOrder.order === 'desc' &&
                  'custom_sort-icon-active'
                "
                style="top: 14px"
              ></i>
            </span>
          </div>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    header: { type: Array, required: true },
    headerCapitalize: { type: Boolean, required: false, default: false },
    tableBordered: { type: Boolean, required: false, default: false },
  },
  emits: ["on-select", "on-sort"],
  components: {},
  setup(props, { emit }) {
    const checked = ref<boolean>(false);
    const columnLabelAndOrder = ref<Sort>({
      key: props.sortLabel,
      order: props.sortOrder,
    });

    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue;
      }
    );

    const selectAll = () => {
      emit("on-select", checked.value);
    };

    const onSort = (key: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.key === key) {
          if (columnLabelAndOrder.value.order === "asc") {
            columnLabelAndOrder.value.order = "desc";
          } else {
            if (columnLabelAndOrder.value.order === "desc") {
              columnLabelAndOrder.value.order = "asc";
            }
          }
        } else {
          columnLabelAndOrder.value.order = "asc";
          columnLabelAndOrder.value.key = key;
        }
        emit("on-sort", columnLabelAndOrder.value);
      }
    };

    const sortArrow = computed(() => {
      return columnLabelAndOrder.value.order === "asc"
        ? "&#x2191;"
        : "&#x2193;";
    });

    return {
      onSort,
      selectAll,
      checked,
      sortArrow,
      columnLabelAndOrder,
    };
  },
});
</script>

<style scoped>
.custom_sort-icon {
  font-size: 0.65rem;
  position: absolute;
  line-height: 0 !important;
}
.custom_sort-icon-active {
  color: var(--kt-table-color);
}
</style>
