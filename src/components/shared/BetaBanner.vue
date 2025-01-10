<!-- BetaBanner.vue -->

<template>
  <img class="beta-banner" v-if="isBeta" src="/media/logos/beta-banner-1.png" />
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const isBeta = ref(
      process.env.VUE_APP_IS_BETA_VERSION == "true" ? true : false
    );

    const dismissBanner = () => {
      isBeta.value = false;
    };

    return {
      isBeta,
      dismissBanner,
    };
  },
});
</script>

<style scoped>
.beta-banner {
  margin-top: -5px;
  height: 85px;
  padding-left: 1rem;
}
</style>
