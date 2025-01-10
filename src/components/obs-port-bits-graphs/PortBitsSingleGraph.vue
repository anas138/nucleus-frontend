<template>
  <div class="row">
    <div class="card">
      <h6>{{ periodType.label }}</h6>
      <div class="card-body">
        <el-skeleton v-if="isLoading" :rows="3" animated />
        <!-- <img :src="imageSrc" v-else /> -->
        <el-image
          :src="imageSrc"
          :zoom-rate="1.2"
          :preview-src-list="[imageForPreview]"
          :initial-index="4"
          style="cursor: pointer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ObserviumService from "@/core/services/ObserviumService";
export default {
  props: {
    portId: {
      type: Number,
      required: true,
    },
    periodType: {
      type: Object,
      rquired: true,
    },
  },
  data() {
    return {
      isLoading: true,
      imageSrc: "",
      imageForPreview: "",
    };
  },
  mounted() {
    ObserviumService.getPortBitsGraph(this.portId, this.periodType.period)
      .then((response) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageSrc = reader.result;
        };
        reader.readAsDataURL(response.data);
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
      });
    ObserviumService.getPortBitsGraph(
      this.portId,
      this.periodType.period,
      "350",
      "650"
    )
      .then((response) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageForPreview = reader.result;
        };
        reader.readAsDataURL(response.data);
      })
      .catch((error) => {
        this.isLoading = false;
      });
  },
};
</script>

<style>
.el-image .el-image__inner {
  all: unset !important;
}
</style>
