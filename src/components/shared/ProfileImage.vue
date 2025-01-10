<template>
  <img
    :src="imageUrl ? imageUrl : AppConstants.HANDLE_IMAGE_ERROR_URL"
    class=""
    :alt="alt"
    @error="handleImageError"
  />
</template>

<script>
import { defineComponent } from "vue";
import { handleImageError } from "@/core/helpers/utils";
import { AppConstants } from "@/constants/app-constants";

export default defineComponent({
  props: {
    imageUrl: { type: [String, null], required: true },
    alt: { type: String, required: false, default: "" },
  },
  setup() {
    return { handleImageError, AppConstants };
  },
});
</script>
