<template>
  <el-dropdown trigger="click" :hide-on-click="false" :max-height="'400px'">
    <span class="d-flex align-items-center text-primary">
      <i class="fa-solid fa-table-columns text-primary me-1"></i>
      Show/Hide Column
      <i class="fa-solid fa-sort-down text-primary ms-1 mb-1"></i>
    </span>
    <template #dropdown>
      <div
        v-for="(item, index) in headerConfig"
        :key="index"
        class="border-bottom"
      >
        <div
          class="d-flex align-items-center justify-content-between px-2 py-1"
        >
          <div class="me-2">
            <el-switch v-model="item.visible" size="small" /><span
              class="fs-6 ms-2"
              >{{ item.columnLabel }}</span
            >
          </div>
          <div class="d-flex mx-1">
            <span class="custom__dashicon" @click="moveUp(index)">
              <i class="fa fa-solid fa-sort-up"></i>
            </span>
            <span class="custom__dashicon" @click="moveDown(index)">
              <i class="fa fa-solid fa-sort-down"></i>
            </span>
            <!-- <button
              class="btn btn-sm btn-outline btn-outline-primary px-3 py-1 me-2"
              :disabled="index === 0"
              @click="moveUp(index)"
            >
              <i class="fa-solid fa-sort-up text-primary mt-2"></i>
            </button>
            <button
              class="btn btn-sm btn-outline btn-outline-primary px-3 py-1 me-2"
              :disabled="index === headerConfig.length - 1"
              @click="moveDown(index)"
            >
              <i class="fa-solid fa-sort-down text-primary mb-2"></i>
            </button> -->
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { filtersMutations } from "@/store/enums/filers-enum";
import { ModuleName } from "@/store/enums/module-enum";
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    headerConfigKeys: { type: Array, required: true, default: () => [] },
    tableColumnFiltrationKey: { type: String, required: true },
  },
  setup(props, ctx) {
    const store = useStore();
    const headerConfig = reactive(props.headerConfigKeys);

    const arraysMatch = (array1, array2) => {
      try {
        const res1 = array1.every((item1, index) => {
          return Object.keys(item1).every((keys) => {
            if (
              array2[index][keys] &&
              item1[keys].toString() === array2[index][keys].toString()
            ) {
              return true;
            } else {
              return false;
            }
          });
        });
        const res2 = array2.every((item1, index) => {
          return Object.keys(item1).every((keys) => {
            if (
              array1[index][keys] &&
              item1[keys].toString() === array1[index][keys].toString()
            ) {
              return true;
            } else {
              if (keys === "visible") {
                return true;
              } else {
                return false;
              }
            }
          });
        });

        if (res1 && res2) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    };

    // const filterColumnObject =
    //   store.getters[`${ModuleName.filters}/getTableColumnFiltration`];
    const filterColumnObject = store.getters[
      `${ModuleName.filters}/getTableColumnFiltration`
    ](props.tableColumnFiltrationKey);

    const isSameArrays = arraysMatch(
      headerConfig,
      filterColumnObject ? filterColumnObject : []
    );

    onMounted(() => {
      if (filterColumnObject && isSameArrays) {
        Object.assign(headerConfig, filterColumnObject);
      } else if (headerConfig.length > 0) {
        Object.assign(
          headerConfig,
          headerConfig.map((val: any) => {
            return { ...val, visible: true };
          })
        );
      }
    });

    const moveUp = (index) => {
      if (index > 0) {
        [headerConfig[index], headerConfig[index - 1]] = [
          headerConfig[index - 1],
          headerConfig[index],
        ];
      }
    };

    const moveDown = (index) => {
      if (index < headerConfig.length - 1) {
        [headerConfig[index], headerConfig[index + 1]] = [
          headerConfig[index + 1],
          headerConfig[index],
        ];
      }
    };

    watch(
      () => headerConfig,
      (val) => {
        store.commit(
          `${ModuleName.filters}/${filtersMutations.SET_SAVE_TABLE_COLUMN_FILTRATION_KEY}`,
          { key: props.tableColumnFiltrationKey, value: val }
        );
      },
      { deep: true }
    );

    return { headerConfig, moveUp, moveDown };
  },
});
</script>
