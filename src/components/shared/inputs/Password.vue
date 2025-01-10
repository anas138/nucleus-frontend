<template>
  <div class="input-group">
    <Field
      class="form-control form-control-solid"
      :type="isPasswordVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      :name="name"
      autocomplete="off"
    />
    <div class="input-group-append">
      <button
        type="button"
        class="btn btn-light h-100 rounded-0"
        @click="togglePasswordVisibility"
      >
        <i
          class="fa"
          :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
          aria-hidden="true"
        ></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Field } from "vee-validate";

export default {
  props: {
    name: {
      required: false,
      type: String,
      default: "password",
    },
    placeholder: {
      type: String,
      required: false,
      default: "Enter password",
    },
  },
  components: {
    Field,
  },

  setup() {
    const isPasswordVisible = ref(false);
    function togglePasswordVisibility() {
      isPasswordVisible.value = !isPasswordVisible.value;
    }

    return {
      togglePasswordVisibility,
      isPasswordVisible,
    };
  },
};
</script>

<style></style>
