<template>
  <!--begin::Wrapper-->
  <div class="container content-styles">
    <auth-header />

    <div class="d-flex flex-column justify-content-center text-center">
      <h1>New Version Available</h1>
      <div class="d-flex justify-content-center mt-5">
        <img src="/media/logos/maintenance.png" />
      </div>
      <p class="mt-5">
        A new version of our application is now available. To access all of the
        latest features and improvements. Simply click the 'Update' button given
        below.
      </p>
      <div class="d-flex justify-content-center">
        <a
          type="button"
          class="btn btn-primary"
          :href="$route.query.redirect?.toString()"
        >
          Update
        </a>
      </div>
    </div>
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AuthHeader from "@/components/authentication/AuthHeader.vue";

export default defineComponent({
  name: "app-update",
  components: {
    AuthHeader,
  },
  setup() {
    return {};
  },
});
</script>
<style>
.content-styles h1 {
  font-size: 30px;
  font-weight: normal;
}
.content-styles img {
  max-height: 140px;
  max-width: 140px;
}
.content-styles p {
  font-size: 15px;
}
</style>
