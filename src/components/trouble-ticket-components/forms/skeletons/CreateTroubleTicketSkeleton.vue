<template>
  <el-skeleton :rows="6" animated>
    <template #template>
      <div class="row">
        <!-- Skeleton for Case Title -->
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-8">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 40px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Sub Department -->
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-8">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 40px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Category -->
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-8">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 40px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Sub Category -->
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-8">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 40px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Medium -->
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-8">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 40px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Description -->
        <div class="row col-md-12 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-2 mt-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-10">
            <el-skeleton-item
              variant="paragraph"
              style="width: 100%; height: 100px"
            ></el-skeleton-item>
          </div>
        </div>

        <!-- Skeleton for Attachments -->
        <div class="row col-md-12 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-2 mt-4">
            <el-skeleton-item
              variant="text"
              style="width: 100%"
            ></el-skeleton-item>
          </label>
          <div class="col-md-10">
            <el-skeleton-item
              variant="paragraph"
              style="width: 100%; height: 100px"
            ></el-skeleton-item>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script>
export default {
  name: "SkeletonLoader",
};
</script>
