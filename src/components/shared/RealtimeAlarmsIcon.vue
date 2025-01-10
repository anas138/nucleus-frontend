<template><div class="online-icon mx-2"></div></template>

<script>
export default {
  props: {
    stayOnline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autoRefreshTimer: null,
    };
  },
  mounted() {
    if (!this.stayOnline) {
      this.autoRefreshTimer = setInterval(() => {
        const icon = document.querySelector(".online-icon");
        icon?.classList.toggle("online");
      }, 500);
    } else {
      const icon = document.querySelector(".online-icon");
      icon?.classList.toggle("online");
    }
  },
  unmounted() {
    clearInterval(this.autoRefreshTimer);
  },
};
</script>

<style scoped>
.online-icon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: red; /* Default color for offline */
  transition: background-color 0.2s ease; /* Smooth color transition */
}

.online {
  background-color: #8ab849; /* Color for online */
}
</style>
