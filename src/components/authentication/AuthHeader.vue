<template>
  <div class="auth__intro">
    <div class="auth__intro-heading">
      <img alt="Logo" src="/media/logos/transworld-logo.png" />
      <div class="auth__intro-heading-text">
        <span class="title">NUCLEUS</span>
        <span class="subtitle">Centralized Network Monitoring System</span>
      </div>
    </div>
    <!-- <h1>Welcome Back</h1> -->
    <p v-if="title">{{ title }}</p>
    <!--end::Title-->

    <div class="text-gray-400 fw-semobold fs-5 mb-5" v-if="subTitle">
      {{ subTitle }}
    </div>

    <!--begin::Link-->
  </div>
</template>
<script lang="ts">
import "./Auth.css";

export default {
  props: {
    title: String,
    subTitle: String,
  },
};
</script>
<style lang=""></style>
