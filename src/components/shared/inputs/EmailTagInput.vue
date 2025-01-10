<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    class="mx-1"
    :closable="!disabled"
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1 w-20"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button
    v-else-if="!disabled"
    class="button-new-tag ml-1"
    size="small"
    @click="showInput"
  >
    + New Email
  </el-button>
  <p v-if="inputError" class="error-message">{{ inputError }}</p>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  name: { required: true },
  value: { required: false, default: () => [] },
  disabled: { type: Boolean, required: false, default: false },
});

const inputValue = ref("");
const dynamicTags = ref<Array<string>>(props.value);
const inputVisible = ref(false);
const inputError = ref("");
const InputRef = ref<InstanceType<typeof ElInput>>();

const emit = defineEmits(["change", "input"]);

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  // const emailPattern = /^[^\s@]+@(tes\.com|tw1\.com)$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (inputValue.value) {
    if (emailPattern.test(inputValue.value)) {
      dynamicTags.value.push(inputValue.value);
      inputVisible.value = false;
      inputValue.value = "";
      inputError.value = ""; // Clear error message
      emit("change", { name: props.name, value: dynamicTags.value });
      emit("input", dynamicTags.value);
    } else {
      inputError.value = "Invalid email address"; // Set error message
    }
  } else {
    inputVisible.value = false;
    inputValue.value = "";
    inputError.value = ""; // Clear error message
  }
};
</script>

<style>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
