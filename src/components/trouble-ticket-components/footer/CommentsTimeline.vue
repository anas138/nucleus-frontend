<template>
  <CustomSpinner title="Please wait, loading Comments Logs" v-if="isLoading" />
  <div class="card card-bordered" v-else>
    <Form @submit="onSubmit">
      <div class="card-header bg-primary">
        <div class="card-title text-white">Comments</div>
      </div>
      <div class="card-body pb-0">
        <p>Widget presents comments captured during workflow stages.</p>
        <!--Comment Form-->

        <div v-if="showCommentBox">
          <basicTextInput
            v-model="values.comment"
            type="textarea"
            placeholder="Write your comment here"
            name="comment"
            :autosize="{ minRows: 4, maxRows: 4 }"
          />

          <div class="fv-plugins-message-container">
            <div class="fv-help-block">{{ errors.comment }}</div>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton"
            class="btn btn-primary"
            v-if="values.comment"
          >
            <span class="indicator-label"> Submit </span>
          </button>
        </div>
      </div>
    </Form>

    <div class="card">
      <div class="card-body pt-1">
        <div class="stages__timeline custom-scroller">
          <el-timeline>
            <el-timeline-item
              v-for="(comment, index) in commentsTimeline"
              :key="'comment-timeline-item-' + index"
            >
              <template #dot>
                <ProfileImage
                  :imageUrl="comment?.user?.profile_picture"
                  class="rounded-circle"
                  height="30"
                  width="30"
                  alt=""
                  style="margin-left: -11px"
                />
              </template>
              <template #default>
                <div class="row mt-2">
                  <div class="col-12 hover-container">
                    <div class="stages__timeline-card">
                      <div class="p-4">
                        <div class="d-flex align-items-center pe-2">
                          <UserInfoCard :user-info="comment?.user" />
                          <span class="text-muted me-2">|</span>
                          <span class="fst-italic text-muted">{{
                            comment?.user?.sub_department?.name
                              ? comment?.user?.sub_department?.name
                              : comment?.user?.department?.name
                          }}</span>
                          <span class="badge badge-info badge-pill">
                            {{ comment?.stage ? comment?.stage?.name : null }}
                          </span>
                        </div>
                        <textarea
                          v-if="
                            isCommentEdit && comment?.id === selectedComment?.id
                          "
                          rows="2"
                          v-model="editComment"
                          class="form-control my-2 text-area"
                        ></textarea>
                        <p v-else>{{ comment?.comment }}</p>
                      </div>
                      <div class="edit-comment">
                        <span v-if="comment?.is_modified">Edited</span>
                      </div>
                    </div>
                    <span
                      class="stages__timeline-time me-2 d-flex justify-content-between align-items-center"
                    >
                      <span class="flex-grow-1">{{
                        $format.datetimeFormat(comment?.created_at)
                      }}</span>
                    </span>
                  </div>
                </div>
              </template>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import { AppConstants } from "@/constants/app-constants";
import { Form, ErrorMessage, useForm, useField } from "vee-validate";
import _ from "lodash";
import basicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { troubleTicketActions } from "@/store/enums/trouble-ticket-enum";
import ProfileImage from "@/components/shared/ProfileImage.vue";
import CustomSpinner from "@/components/shared/CustomSpinner.vue";
import UserInfoCard from "@/components/shared/UserInfoCard.vue";

export default defineComponent({
  components: {
    basicTextInput,
    ProfileImage,
    Form,
    CustomSpinner,
    UserInfoCard,
  },
  props: {
    showCommentBox: { type: Boolean, required: false, default: true },
  },
  setup(props) {
    const store = useStore();
    const isLoading = ref(true);
    const isCommentEdit = ref(false);
    const selectedComment = ref("");
    const editComment = ref();
    const validationSchema = createYupValidationSchema({
      comment: "required",
    });

    const {
      handleSubmit,
      errors,
      resetForm,
      values,
      setFieldValue,
      handleReset,
    } = useForm({
      // validationSchema: validationSchema,
      initialValues: {
        comment: "",
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // const commentField = useField("comment");

    const commentsTimeline = computed(() => {
      return store.getters[`${ModuleName.troubleTicket}/getCommentLog`];
    });

    const troubleTicketId = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.id
    );

    const onSubmit = handleSubmit(async (val) => {
      const id = troubleTicketId.value;
      const res = await TroubleTicketService.addComment(id, val);
      resetForm();
      ElNotificationSuccess(res.message);
      await store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_COMMENTS}`,
        id
      );
    });

    const editCommentHandler = (comment) => {
      isCommentEdit.value = true;
      selectedComment.value = comment;
      editComment.value = comment.comment;
    };

    const updateComment = async (id) => {
      // Your update comment logic here
    };

    const cancelEditComment = () => {
      isCommentEdit.value = false;
      editComment.value = null;
    };

    onMounted(async () => {
      await store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_COMMENTS}`,
        troubleTicketId.value
      );
      isLoading.value = false;
    });

    return {
      // commentField,
      isLoading,
      isCommentEdit,
      selectedComment,
      editComment,
      commentsTimeline,
      editCommentHandler,
      updateComment,
      cancelEditComment,
      onSubmit,
      handleSubmit,
      errors,
      resetForm,
      values,
    };
  },
});
</script>

<style scoped>
.stages__timeline {
  max-height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  margin-left: 4px;
}
.stages__timeline-card {
  border-radius: 22px !important;
  background-color: var(--kt-light);
  margin-right: 4px;
}
.stages__timeline-time {
  font-size: 0.8rem;
  margin: 8px 0px 0px 8px;
}
.edit-icon {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.hover-container:hover .edit-icon {
  opacity: 1;
}
.text-area {
  border-radius: 10px;
  border-color: var(--kt-light);
}
.edit-comment {
  text-align: end;
  color: #8f9b97;
  margin-right: 20px;
}
</style>
