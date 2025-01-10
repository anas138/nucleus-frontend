<template>
  <div
    class="d-flex align-items-center"
    :class="!filterTemplateEnabled && 'me-5'"
  >
    <label class="col-form-label fs-6">Search: </label>
    <input
      data-kt-subscription-table-filter="search"
      class="form-control form-control-solid w-250px mx-3"
      v-model="selectedValue"
      :placeholder="placeholder"
      :clearable="true"
      :disabled="disabled"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      class="spinner-border spinner-border-sm"
      v-if="searchInputLoading"
    ></span>
    <el-tooltip
      :content="`Searchable columns are [${toolTipContent}]`"
      :placement="'top'"
      v-else-if="toolTipContent"
    >
      <i
        class="fa-solid fa-info tooltip_bg_color rounded-circle px-2 py-1 text-white fs-9"
      ></i
    ></el-tooltip>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import { string } from "yup/lib/locale";
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    toolTipContent: {
      type: String,
      required: false,
      default: "",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: String,
      required: false,
      default: "",
    },
    filterTemplateEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    searchInputLoading: { type: Boolean, default: false },
  },
  emits: ["change", "input", "onFocus", "onBlur"],
  setup(props, ctx) {
    const selectedValue = ref(props.value);

    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue });
      ctx.emit("input", newValue);
    });

    // Event handlers
    const handleFocus = () => {
      ctx.emit("onFocus");
    };

    const handleBlur = () => {
      ctx.emit("onBlur");
    };
    return {
      handleFocus,
      handleBlur,
      selectedValue,
    };
  },
};
</script>
