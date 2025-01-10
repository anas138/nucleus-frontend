<template>
  <el-upload
    class="upload-demo"
    :drag="!disabled"
    :action="fileUploadUrl"
    :headers="getHeaders"
    :file-list="fileList"
    @success="onFileUpload"
    @remove="handleFileRemove"
    @preview="handlePreview"
    :disabled="disabled"
    :accept="accept"
    @error="handleError"
    :before-upload="beforeUpload"
    :limit="limit"
    @exceed="exceedCallBack"
    multiple
  >
    <div v-if="!disabled">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </div>
    <div v-if="!disabled" class="el-upload__tip">
      {{ accept }} file formats with a size less than
      {{ AppConstants.ALLOWED_MAX_FILE_SIZE }}MB
    </div>
  </el-upload>
</template>

<script lang="ts">
import { reactive, computed, watch, onBeforeMount } from "vue";
// import { removeUploadedFile } from "@/services/uploadService";
// import { encodeUrl } from "@/utils/CommonUtils";
import JwtService from "@/core/services/JwtService";
import { encodeUrl } from "@/core/helpers/utils";
import { ElNotificationError } from "@/core/helpers/ElNotification.utils";
import { AppConstants } from "@/constants/app-constants";

export default {
  props: {
    headers: {
      type: Object,
      default: () => ({}),
    },
    // fileList: {
    //   type: Array,
    //   default: () => [],
    // },
    documentsList: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: ".pdf, .doc, .docx, .xlsx, .csv, .jpg, .png, .msg",
      description: "Accepted file types",
    },
    documentType: {
      type: String,
      description:
        "document-type to differentiate attachments while fetching,processing,uploading | e.g SOLUTION_DESIGN",
    },
    limit: {
      type: Number,
      default: 5,
    },
    exceedCallBack: {
      type: Function,
    },
  },
  emit: ["attachmentList", "uploadingFile"],
  setup(props, { emit }) {
    let uploadedDocs = reactive<any[]>([]);
    let fileList = reactive<any[]>([]);
    const fileUploadUrl = process.env.VUE_APP_API_URL + "upload";

    const getHeaders = computed(() => {
      return { Authorization: `Bearer ${JwtService.getToken()}` };
    });

    const onFileUpload = (response, file) => {
      emit("uploadingFile", false);
      console.log({ response, file });
      fileList.push({
        id: response.data.id,
        url: response.data.url,
        mime: response.data.mime,
        name: response.data.name,
        // name: file.name,
      });
      const newDocsList = getDocsArray();
      uploadedDocs = [...newDocsList];
      emit("attachmentList", newDocsList);
    };

    const handleFileRemove = async (file) => {
      console.log({ file: file });
      try {
        if (file?.status == "uploading") {
          emit("uploadingFile", false);
        }
        const findFile = uploadedDocs.find(
          (item) =>
            item.name === file.name || item.id === file?.response?.data?.id
        );
        console.log({ findFile });

        if (findFile) {
          // const resp = await removeUploadedFile(findFile.id);
          uploadedDocs = uploadedDocs.filter(
            (item) => item.id !== findFile?.id
          );
          fileList = fileList.filter((item) => item.id !== findFile?.id);
          // const newDocsList = getDocsArray();
          emit("attachmentList", uploadedDocs);
        }
      } catch (err) {
        console.error(err);
        // this.$message({
        //   message: "Could not remove file, try again later.",
        //   type: "error",
        // });
      }
    };

    const getDocsArray = () => {
      const documents = [] as any[];
      fileList.forEach((item) => {
        documents.push({
          id: item.id,
          url: item.url,
          mime: item.mime,
          document_type: props.documentType,
          name: item.name,
        });
      });
      return documents;
    };

    const handlePreview = (file) => {
      console.log({ file });
      const url = file.response
        ? encodeUrl(file.response.data.url)
        : encodeUrl(file.url);
      window.open(url, "_blank");
    };

    const beforeUpload = (file) => {
      console.log({ file });

      const isLt2M =
        file.size / 1024 / 1024 < AppConstants.ALLOWED_MAX_FILE_SIZE;
      if (!isLt2M) {
        // this.$message.error(`File size can not exceed ${20}MB!`);
        ElNotificationError(
          `File size can not exceed ${AppConstants.ALLOWED_MAX_FILE_SIZE}MB!`
        );
      } else if (isLt2M) {
        emit("uploadingFile", true);
      }
      return isLt2M;
    };

    const handleError = (err, file, fileList) => {
      emit("uploadingFile", false);
      const resp = JSON.parse(err.message);
      console.error(resp.message);
      ElNotificationError(resp.message);
    };

    watch(
      () => fileList,
      (newvalue) => {
        console.log({ newvalue });

        // uploadedDocs = newvalue;
      },
      {
        deep: true,
      }
    );

    return {
      AppConstants,
      uploadedDocs,
      fileUploadUrl,
      getHeaders,
      fileList,
      onFileUpload,
      handleFileRemove,
      handlePreview,
      beforeUpload,
      handleError,
    };
  },
};
</script>

<style></style>
