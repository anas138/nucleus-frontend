<template>
  <div class="auth-copyright">
    <span
      >© {{ new Date().getFullYear() }}
      <span class="font-weight-bold" style="color: #ff6600"
        ><a href="https://www.tw1.com/" target="_blank"
          >Transworld Associates</a
        ></span
      >. All Rights Reserved.</span
    >
  </div>
</template>

<script>
export default { name: "copy-right" };
</script>
<style scoped>
.auth-copyright {
  position: absolute;
  bottom: 12px;
  left: 24%;
  transform: translateX(-50%);
}
@media (max-width: 650px) {
  .auth-copyright {
    left: 45%;
  }
}
</style>
