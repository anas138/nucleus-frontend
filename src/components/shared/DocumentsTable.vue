<template>
  <el-table
    v-if="documents?.length > 0"
    :data="documents"
    border
    hover
    size="small"
    responsive
    :header-cell-style="headerCellStyle"
  >
    <el-table-column label="Sr" width="50">
      <template #default="{ $index }">{{ $index + 1 }}</template>
    </el-table-column>
    <el-table-column label="Name">
      <template #default="{ row }">
        <a :href="row.url" target="_blank">{{ row?.name }}</a>
      </template>
    </el-table-column>
    <el-table-column label="Type">
      <template #default="{ row }">
        {{ row?.document_type?.replace(/_/g, " ") }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="Uploaded By">
      <template #default="{ row }">
        {{ row?.upload_by?.full_name }}
      </template>
    </el-table-column> -->
    <el-table-column label="Uploaded On">
      <template #default="{ row }">
        {{ $format.datetimeFormat(row?.created_at) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const headerCellStyle = () => {
      return {
        backgroundColor: "#f60", // Background color for header cells
        color: "#ffffff", // Text color for header cells
      };
    };

    return {
      headerCellStyle,
    };
  },
});
</script>
