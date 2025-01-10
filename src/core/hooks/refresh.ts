import { ref } from "vue";

export function useRefresh() {
  const refreshKey = ref(0);
  const incrementRefresh = () => {
    refreshKey.value++;
  };
  return { refreshKey, incrementRefresh };
}
