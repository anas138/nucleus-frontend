<script lang="ts">
import GlobalSettingService from "@/core/services/GlobalSettingService";
import { Mutations } from "@/store/enums/StoreEnums";
import { defineComponent, watch, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
import SocketIoService from "@/core/services/SocketIoService";
export default defineComponent({
  name: "build-update-finder",
  setup() {
    const store = useStore();
    const route = useRoute();
    const appVersion = computed(() => store.getters.getAppVersion);

    const checkAppVersion = () => {
      GlobalSettingService.getAppVersion()
        .then((res) => {
          const versionDB = res.data.data.app_version;
          store.commit(Mutations.SET_APP_VERSION_DB, versionDB);
          if (versionDB && appVersion.value !== versionDB) {
            router.push({
              name: "app-update",
              query: { redirect: route.path },
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    /**
     * Realtime webapp-update event-listening
     */
    onMounted(() => {
      SocketIoService.registerWebappUpdatEventListener();
    });
    onUnmounted(() => {
      SocketIoService.unRegisterWebappUpdateEventListener();
    });

    watch(
      () => route.path,
      () => {
        checkAppVersion();
      },
      {
        immediate: true,
      }
    );
  },
});
</script>
