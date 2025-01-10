<template>
  <div>
    <div class="spinner__row" :style="{ padding: padding }">
      <div :class="parentClass">
        <div
          :class="childClass"
          :style="{ backgroundColor: color }"
          v-for="item in childrenCount"
          :key="'spinkit-child-' + item"
        ></div>
      </div>
    </div>
    <div class="d-flex flex-column text-center">
      <h1 class="title" v-if="title">{{ title }}</h1>
      <p class="message" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
export default {
  props: {
    type: {
      type: String,
      default: "wave",
      description:
        "wave | chase | bounce | plus | flow | circle | circle-fade | wander | grid",
    },
    color: {
      type: String,
      default: "#f07d00", // primary-color
    },
    title: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    padding: {
      type: String,
      default: "1.5rem",
      description: "padding in rem/px",
    },
  },
  setup(props) {
    const childrenCount = ref(0);
    const childClass = ref("");
    const getChildrenClass = () => {
      let childClass = "sk-" + props.type;
      switch (props.type) {
        case "wave":
          childClass += "-rect";
          childrenCount.value = 5;
          break;
        case "chase":
        case "bounce":
        case "flow":
        case "swing":
        case "circle":
        case "circle-fade":
          childClass += "-dot";
          childrenCount.value = 5;
          break;
        case "grid":
          childClass += "-cube";
          childrenCount.value = 9;
          break;
        default:
          childClass += "-dot";
          childrenCount.value = 5;
          break;
      }
      console.log("childClass", childClass);
      return childClass;
    };
    onBeforeMount(() => {
      childClass.value = getChildrenClass();
    });

    const parentClass = computed(() => {
      return "sk-" + props.type;
    });

    return {
      childrenCount,
      getChildrenClass,
      parentClass,
      childClass,
    };
  },
};
</script>

<style scoped>
.spinner__row {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 1rem;
}
.message {
  font-size: 0.8rem;
}
</style>
