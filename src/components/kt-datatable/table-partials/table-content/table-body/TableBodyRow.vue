<template>
  <tbody class="fw-semibold text-gray-600">
    <template v-for="(row, i) in data" :key="i">
      <tr
        @click="
          () => {
            row?.onClick && row?.onClick();
            //this will send data back to parent
            $emit('row-click', row);
          }
        "
        :class="row?.style?.class"
        :style="row?.style?.style"
      >
        <td v-if="checkboxEnabled">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="row[checkboxLabel]"
              v-model="selectedItems"
              @change="onChange"
            />
          </div>
        </td>
        <template v-for="(properties, j) in header" :key="j">
          <td
            :class="{
              // 'text-center': j === header.length - 1
            }"
            :style="properties.boxColor && properties.boxColor(row).boxStyle"
          >
            <slot :name="`${properties.key}`" :row="row">
              {{ row[prop] }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "table-body-row",
  components: {},
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    currentlySelectedItems: { type: Array, required: false, default: () => [] },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
  },
  emits: ["on-select", "row-click"],
  setup(props, { emit }) {
    //eslint-disable-next-line
    const selectedItems = ref<Array<any>>([]);

    watch(
      () => [...props.currentlySelectedItems],
      (currentValue) => {
        if (props.currentlySelectedItems.length !== 0) {
          selectedItems.value = [
            ...new Set([...selectedItems.value, ...currentValue]),
          ];
        } else {
          selectedItems.value = [];
        }
      }
    );

    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    return {
      selectedItems,
      onChange,
    };
  },
});
</script>
