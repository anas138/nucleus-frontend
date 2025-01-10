<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      :header="headerConfig"
      :data="dataToDisplay"
      :empty-table-text="loading ? `` : 'No data found'"
      :loading="loading"
      :displayForCard="true"
      :style="{ height: tableType == 'Widget' ? '265px' : 'auto' }"
    >
      <template
        v-for="head in headerConfig"
        :key="head.key"
        v-slot:[head.key]="{ row: item }"
      >
        <template v-if="$slots[head.key]">
          <slot :name="head.key" :row="item" />
        </template>
        <template v-else>
          <!-- if you pass a slot then that will not have a tooltip-->
          <el-tooltip
            v-if="
              item[head.key]?.length >
                (head.textOverflowLimit ? head.textOverflowLimit : 30) &&
              head.textOverflow
            "
            :content="item[head.key]"
            placement="top"
          >
            <span>{{
              `${item[head.key].slice(
                0,
                head.textOverflowLimit ? head.textOverflowLimit : 30
              )} .......`
            }}</span>
          </el-tooltip>
          <span v-else>{{ item[head.key] }}</span>
        </template>
      </template>
    </TableContent>
  </div>
</template>
<script lang="ts">
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
export default {
  components: { TableContent },
  props: {
    headerConfig: { type: Array, required: true },
    dataToDisplay: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    tableType: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    return {};
  },
};
</script>
