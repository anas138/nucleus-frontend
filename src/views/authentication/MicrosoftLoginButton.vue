<template>
  <div>
    <button
      @click="loginWithMicrosoft"
      class="btn btn-outline btn-outline-primary"
      type="button"
      :disabled="isSubmitting"
    >
      <img
        src="/media/logos/ms-logo.png"
        alt="Microsoft Logo"
        class="ms-logo"
      />
      <span>Login with Microsoft</span>
    </button>
  </div>
</template>
<script lang="ts">
import { ROUTES } from "@/constants/app-constants";
import { msalPublicClientApp } from "@/core/config/microsoftOAuthConfig";
import msalAuthService from "@/core/services/msalAuthService";
import { Actions } from "@/store/enums/StoreEnums";
import { ref, defineComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  props: { submitMSButton: { type: Boolean, required: true } },
  emits: ["buttonSubmitted"],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const isSubmitting = ref<boolean>(false);

    const defaultDashboardRoute = store.getters.getDefaultDashboard;

    const loginWithMicrosoft = () => {
      isSubmitting.value = true;
      emit("buttonSubmitted", true);

      msalAuthService.signIn(
        async (response) => {
          // Send login request
          await store
            .dispatch(Actions.LOGIN_WITH_MS, {
              email: response.account.username,
              msalLoginResponse: response,
            })
            .then(async (res) => {
              await store.dispatch(Actions.GET_ALL_PERMISSIONS);
              if (route.query.redirect) {
                router.push({ path: route.query.redirect.toString() });
              } else {
                router.push({
                  path: defaultDashboardRoute
                    ? defaultDashboardRoute
                    : ROUTES.DASHBOARD.INDEX,
                });
              }
            })
            .catch((error) => console.log(error))
            .finally(() => {
              isSubmitting.value = false;
              emit("buttonSubmitted", false);
            });
        },
        (error) => {
          console.log({ error });
          isSubmitting.value = false;
          emit("buttonSubmitted", false);
        }
      );
    };

    watch(
      () => props.submitMSButton,
      (val) => (isSubmitting.value = val)
    );

    return {
      isSubmitting,
      loginWithMicrosoft,
    };
  },
});
</script>
<style scoped>
.ms-logo {
  height: 30px;
  margin-right: 10px;
}
</style>
