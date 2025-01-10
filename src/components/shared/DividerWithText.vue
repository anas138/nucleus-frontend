<template>
  <div class="kDivider">
    <span class="kDivider-message hint-class">
      {{ message }}
      <!--Padding is optional-->
    </span>
  </div>
</template>

<script>
export default {
  props: ["message"],
};
</script>

<style scoped>
.kDivider {
  width: 100%;
  height: 12px;
  border-bottom: 1px solid var(--kt-gray-400);
  text-align: center;
  margin-top: 0.8rem;
  margin-bottom: 2rem;
}
.kDivider-message {
  font-size: 12px;
  background-color: var(--kt-card-border-color);
  padding: 4px 10px;
}
</style>
