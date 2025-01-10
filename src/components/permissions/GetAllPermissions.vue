<script lang="ts">
import { Actions } from "@/store/enums/StoreEnums";
import { defineComponent, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();

    const getAllUserPermissions = async () => {
      await store.dispatch(Actions.GET_ALL_PERMISSIONS);
    };

    watch(
      () => route.path,
      () => {
        getAllUserPermissions();
      },
      {
        immediate: true,
      }
    );
  },
});
</script>
