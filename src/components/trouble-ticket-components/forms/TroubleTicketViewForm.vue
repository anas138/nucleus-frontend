<template>
  <div class="tip">
    <div class="d-flex justify-content-between">
      <p class="no-gutters p-0 m-0">
        Following are the Trouble Ticket
        <b>{{ ticketData?.ticket_number }}</b> related details:
      </p>
      <span
        v-html="TroubleTicketViewModeEsclationLevel(ticketData?.esclationLevel)"
      />
    </div>
  </div>

  <Form>
    <div class="card card-bordered my-5">
      <div class="card-body p-5">
        <div class="">
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Case Title</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">{{
              ticketData?.case_title
            }}</span>
          </div>
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Medium</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">{{
              ticketData?.troubleTicketMedium?.label
            }}</span>
          </div>
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Category</label
            >
            <span
              class="col-md-6 col-form-label text-wrap fw-normal"
              v-if="!isEditable"
              >{{ ticketData?.troubleTicketCategory?.name }}</span
            >
            <div class="col-md-6" v-else>
              <CategoryDropDown
                v-model="values.trouble_ticket_category_id"
                placeholder="Select Category"
                name="trouble_ticket_category_id"
                @change="
                  (val) => {
                    values.trouble_ticket_sub_category_id = null;
                    categoryId = val.value;
                  }
                "
                :clearable="false"
              />
            </div>
          </div>
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Sub Category</label
            >
            <span
              class="col-md-6 col-form-label text-wrap fw-normal"
              v-if="!isEditable"
            >
              {{ ticketData?.troubleTicketSubCategory?.name }}
            </span>

            <div
              class="col-md-6"
              v-else
              :key="values.trouble_ticket_category_id"
            >
              <SubCategoryDropDown
                :categoryId="values.trouble_ticket_category_id"
                v-model="values.trouble_ticket_sub_category_id"
                @change="
                  (val) => {
                    categoryId = val.value;
                  }
                "
                placeholder="Select Sub Category"
                name="trouble_ticket_sub_category_id"
                :clearable="false"
              />
            </div>
          </div>
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Priority</label
            >
            <span
              class="col-md-6 col-form-label text-wrap fw-normal"
              v-if="
                completeId === ticketData?.currentStatus?.id ||
                cancelledId === ticketData?.currentStatus?.id ||
                !$hasPermission(troubleTicketCreatePermission)
              "
            >
              <span
                v-html="
                  TroubleTicketPriorityBadge(ticketData?.priorityLevel?.id)
                "
              ></span>
            </span>
            <div class="col-md-6" v-else>
              <PriorityDropDown
                v-model="values.priority_level"
                placeholder="Select Priority"
                name="priority_level"
                :value="values.priority_level"
                @blur="formUseFields.priority_level.handleBlur"
                @input="formUseFields.priority_level.handleChange"
                @change="onPriorityChange"
              />

              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  {{ errors.priority_level }}
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-1">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Description</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.description }}
            </span>
          </div>
          <div class="row mb-1" v-if="ticketData?.resolutionReason">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Resolution Reason</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.resolutionReason?.label }}
            </span>
          </div>
          <div class="row mb-1" v-if="ticketData?.resolution_comment">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Resolution Comment</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.resolution_comment }}
            </span>
          </div>
          <div class="row mb-1" v-if="ticketData?.cancelReason">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Cancelation Reason</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.cancelReason?.label }}
            </span>
          </div>
          <div class="row mb-1" v-if="ticketData?.cancel_comment">
            <label class="col-form-label fw-semobold fs-6 col-md-4"
              >Cancelation Comment</label
            >
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.cancel_comment }}
            </span>
          </div>
        </div>

        <divider-with-text message="Estimated Turn Around Time details:" />

        <div class="mb-8">
          <div class="row ml-1 pl-3 pr-3">
            <div class="text-muted text-justify mb-3">
              <i class="font-weight-lighter"
                >Time required to resolve an issue. By default Turn Around Time
                is pre-calculated based on Category selected. You can also
                update it according to your need.
              </i>
            </div>
          </div>
          <div class="row ml-1">
            <label class="col-form-label col-md-4" for="ticket_subcategory_id"
              >Turn Around Time
            </label>

            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ tatData.tat }} {{ tatData.tatType }}</span
            >
          </div>
          <div class="row ml-1">
            <label class="col-form-label col-md-4" for="ticket_subcategory_id"
              >Start Time
            </label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ $format.datetimeFormat(tatData?.tat_start_time) }}
            </span>
          </div>
          <div class="row ml-1">
            <label class="col-form-label col-md-4" for="ticket_subcategory_id"
              >End Time
            </label>

            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ $format.datetimeFormat(tatData?.tat_end_time) }}
            </span>
          </div>
          <div class="row ml-1">
            <label class="col-form-label col-md-4" for="ticket_subcategory_id"
              >Over TAT
            </label>
            <span
              v-html="StatusBadge(ticketData?.over_tat)"
              class="col-md-6 col-form-label pe-2"
            >
            </span>
          </div>
        </div>

        <div v-if="attachmentslist?.length">
          <divider-with-text message="Attached Documents:" />
          <div class="row pt-5">
            <div class="col-form-label col-md-2">Attachments</div>
            <div class="col-md-10">
              <DocumentsTable :documents="attachmentslist" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tip">
      <div class="d-flex justify-content-between">
        <p class="no-gutters p-0 m-0">User Actions</p>
      </div>
    </div>
    <div class="card card-bordered my-5">
      <div class="card-body p-5">
        <divider-with-text message="Assignment Details:" />

        <div class="row mb-3">
          <label class="col-form-label col-md-4">Sub-Department </label>

          <div
            class="col-md-7"
            v-if="
              isEditable &&
              (ticketData?.permissions?.can_assign_ticket || isReOpened)
            "
          >
            <SubDepartmentEngineeringDropDown
              :departmentId="ticketData?.department_id"
              v-model="values.sub_department_id"
              placeholder="Select Sub Department"
              name="sub_department_id"
              :clearable="false"
              @change="
                () => {
                  values.assigned_to_id = null;
                  isAssignedChanged = true;
                }
              "
              @blur="formUseFields.sub_department_id.handleBlur"
              @input="formUseFields.sub_department_id.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.sub_department_id }}</div>
            </div>
          </div>

          <span class="col-md-6 col-form-label text-wrap fw-normal" v-else>
            {{ ticketData?.subDepartment?.name }}</span
          >
        </div>

        <div
          class="row mb-3"
          v-if="
            ticketData?.assignedToUser ||
            (isEditable && ticketData?.permissions?.can_assign_ticket)
          "
        >
          <label class="col-form-label col-md-4">Worker </label>

          <div
            class="col-md-7"
            v-if="
              isEditable &&
              (ticketData?.permissions?.can_assign_ticket || isReOpened)
            "
            :key="values.sub_department_id"
          >
            <employee-drop-down
              :sub-department-id="values.sub_department_id"
              :name="'assigned_to_id'"
              v-model="values.assigned_to_id"
              :clearable="false"
              @change="
                () => {
                  isAssignedChanged = true;
                }
              "
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.assigned_to_id }}</div>
            </div>
          </div>

          <span class="col-md-6 col-form-label text-wrap fw-normal" v-else>
            {{ ticketData?.assignedToUser?.username }}</span
          >
        </div>

        <div v-if="ticketData?.rca_submitted">
          <div class="my-10">
            <divider-with-text message="RCA" />
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Start Time</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ $format.datetimeFormat(ticketData?.rca_start_time) }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">End Time</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ $format.datetimeFormat(ticketData?.rca_end_time) }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Root Cause</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.rca_reason }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Corrective Action</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.corrective_action }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Preventive Measures</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.preventive_step }}
            </span>
          </div>
        </div>

        <div v-if="ticketData?.currentTicketPause">
          <div class="my-10">
            <divider-with-text message="Pause Request" />
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Pause Start Time</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{
                $format.datetimeFormat(
                  ticketData?.currentTicketPause?.pause_start_time
                )
              }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Pause End Time</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{
                $format.datetimeFormat(
                  ticketData?.currentTicketPause?.pause_end_time
                )
              }}
            </span>
          </div>
          <div class="row">
            <label class="col-form-label col-md-4">Pause Reason</label>
            <span class="col-md-6 col-form-label text-wrap fw-normal">
              {{ ticketData?.currentTicketPause?.pause_reason }}
            </span>
          </div>
        </div>

        <div v-if="isEditable">
          <div v-if="!ticketData?.permissions?.can_submit_rca">
            <div class="my-10">
              <divider-with-text message="Attach New Documents:" />
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold fs-6 col-md-3"
                >Attachments:</label
              >
              <div class="col-md-9">
                <DocumentsUploader
                  @attachmentList="
                    (val) => {
                      values.attachment = val;
                    }
                  "
                  @uploadingFile="uploadingStatus"
                />
              </div>
            </div>
          </div>

          <div
            class="my-10"
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#RCA_Collapsible"
            v-if="
              ticketData?.permissions?.can_submit_rca ||
              (!isRCAAwaited && ticketData?.permissions?.can_resolve_ticket)
            "
          >
            <divider-with-text message="RCA Available:" />
          </div>

          <div
            id="RCA_Collapsible"
            class="collapse show"
            v-if="
              ticketData?.permissions?.can_submit_rca ||
              (!isRCAAwaited && ticketData?.permissions?.can_resolve_ticket)
            "
          >
            <div
              class="d-flex align-items-center justify-content-center text-danger mb-7"
              v-if="ticketData?.permissions?.can_resolve_ticket"
            >
              To skip the RCA for now, please enable the "RCA Awaited" toggle
              provided below.
            </div>
            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold required fs-6 col-md-4"
                >Start Time</label
              >
              <div class="col-md-8">
                <el-date-picker
                  v-model="values.rca_start_time"
                  type="datetime"
                  placeholder="Select date"
                  :format="DATETIME_FOR_FROM_TO_SELECTOR"
                  :disabled-date="disableDates"
                />

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">{{ errors.rca_start_time }}</div>
                </div>
              </div>
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold required fs-6 col-md-4"
                >End Time</label
              >
              <div class="col-md-8">
                <el-date-picker
                  v-model="values.rca_end_time"
                  type="datetime"
                  placeholder="Select date"
                  :format="DATETIME_FOR_FROM_TO_SELECTOR"
                  :disabled-date="disableDates"
                />

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">{{ errors.rca_end_time }}</div>
                </div>
              </div>
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold fs-6 required col-md-4"
                >Root Cause</label
              >
              <div class="col-md-8">
                <basicTextInput
                  v-model="values.rca_reason"
                  type="textarea"
                  :placeholder="'Root Cause'"
                  name="rca_reason"
                  @blur="formUseFields.rca_reason.handleBlur"
                  @input="formUseFields.rca_reason.handleChange"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                />

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">{{ errors.rca_reason }}</div>
                </div>
              </div>
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold fs-6 required col-md-4"
                >Corrective Action</label
              >
              <div class="col-md-8">
                <basicTextInput
                  v-model="values.corrective_action"
                  type="textarea"
                  :placeholder="'Corrective Action'"
                  name="corrective_action"
                  @blur="formUseFields.corrective_action.handleBlur"
                  @input="formUseFields.corrective_action.handleChange"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                />

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    {{ errors.corrective_action }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold fs-6 required col-md-4"
                >Preventive Measures</label
              >
              <div class="col-md-8">
                <basicTextInput
                  v-model="values.preventive_step"
                  type="textarea"
                  :placeholder="'Preventive Measures'"
                  name="preventive_step"
                  @blur="formUseFields.preventive_step.handleBlur"
                  @input="formUseFields.preventive_step.handleChange"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                />

                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">{{ errors.preventive_step }}</div>
                </div>
              </div>
            </div>

            <div class="row col-md-12 mb-6">
              <label class="col-form-label fw-semobold fs-6 col-md-4"
                >RCA Attachments:</label
              >
              <div class="col-md-8">
                <DocumentsUploader
                  documentType="RCA"
                  @attachmentList="
                    (val) => {
                      values.attachment = val;
                    }
                  "
                  @uploadingFile="uploadingStatus"
                />
              </div>
            </div>
          </div>

          <div class="my-10">
            <divider-with-text message="Add Comments:" />
          </div>

          <div class="row col-md-12 mb-6">
            <label class="col-form-label fw-semobold required fs-6 col-md-3"
              >Comment</label
            >
            <div class="col-md-9">
              <basicTextInput
                v-model="values.comment"
                type="textarea"
                :placeholder="''"
                name="comment"
                @blur="formUseFields.comment.handleBlur"
                @input="formUseFields.comment.handleChange"
                :autosize="{ minRows: 4, maxRows: 4 }"
              />

              <div class="fv-plugins-message-container">
                <div class="fv-help-block">{{ errors.comment }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="card-footer d-flex justify-content-between pt-3 pb-6 px-9"
        v-if="isEditable"
      >
        <TroubleTicketActionButtons
          :validate="validate"
          :isReOpened="isReOpened"
          :isRCAFlag="Object.keys(rcaRequiredTempPayload).length ? true : false"
          @leaveTicket="buttonStatusCheck"
          @send-back-ticket="buttonStatusCheck"
          @reopen-ticket="reOpenFlowCheck"
          @is-re-opened-cancel="isReOpenedCancel"
          @updateTicket="buttonStatusCheck"
          @resolvedTicket="buttonStatusCheck"
          @completeTicket="buttonStatusCheck"
          @cancel-ticket="buttonStatusCheck"
          @r-c-a-required="buttonStatusCheck"
          @r-c-a-awaited="() => (isRCAAwaited = !isRCAAwaited)"
          :isRCAAwaited="isRCAAwaited"
          @r-c-a-submit="buttonStatusCheck"
          @pause-request-ticket="() => (pauseModal = true)"
          @pause-request-approve-ticket="buttonStatusCheck"
          @cancel-pause-request-ticket="buttonStatusCheck"
          :button-loading-status="buttonLoadingStatus"
        />
      </div>
    </div>
  </Form>
  <TroubleTicketResolutionModal
    :modal-visible="resolutionModal"
    :resolvePayload="resolveTempPayload"
    v-model:modal-disable="resolutionModal"
    @resolution-submit="resolveTicket"
    v-if="isEditable"
  />
  <TroubleTicketCancelModal
    :modal-visible="cancelationModal"
    v-model:modal-disable="cancelationModal"
    @cancelationSubmit="cancelTicket"
    v-if="isEditable"
  />
  <TroubleTicketRCAModal
    :modal-visible="rcaRequiredModal"
    :rca-payload="rcaRequiredTempPayload"
    @update:modal-disable="
      (val) => {
        if (!val && buttonLoadingStatus == null) {
          rcaRequiredModal = val;
          rcaRequiredTempPayload = {};
        }
      }
    "
    @rca-submit="rcaRequiredTicket"
    v-if="isEditable"
  />
  <ToubleTicketPauseModal
    :modal-visible="pauseModal"
    v-model:modal-disable="pauseModal"
    :pausePayload="pauseApproveTempPayload"
    @pauseSubmit="pauseTicket"
    v-if="isEditable"
  />
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
import _ from "lodash";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import { Form, ErrorMessage, useForm, useField } from "vee-validate";
import DividerWithText from "@/components/shared/DividerWithText.vue";
import DocumentsTable from "@/components/shared/DocumentsTable.vue";
import basicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import CategoryDropDown from "@/components/shared/dropdowns/CategoryDropDown.vue";
import SubCategoryDropDown from "@/components/shared/dropdowns/SubCategoryDropDown.vue";
import SubDepartmentEngineeringDropDown from "@/components/shared/dropdowns/SubDepartmentEngineeringDropDown.vue";
import EmployeeDropDown from "@/components/shared/dropdowns/UsersBySubDepartmentDropDown.vue";
import TroubleTicketService from "../../../core/services/TroubleTicketService";
import DocumentsUploader from "@/components/shared/DocumentsUploader.vue";
import TroubleTicketActionButtons from "@/components/trouble-ticket-components/footer/action-buttons/TroubleTicketActionButtons.vue";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import router from "@/router";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { UpdateTroubleTicket } from "@/core/interface/trouble-ticket-interfaces";
import {
  UpdateTroubleTicketModel,
  LeaveTicketModel,
  SendBackTicketModel,
  ReopenTicketModel,
  ResolvedTicketModel,
  CompletedTicketModel,
  CanAssignTicketModel,
  UpdateTicketModel,
  RCARequiredTicketModel,
  RCATicketModel,
  PauseRequestTicketModel,
  PauseRequestApproveTicketModel,
  CancelPauseRequestTicketModel,
  CancelTicketModel,
} from "@/core/model/trouble-ticket-model";
import * as yup from "yup";
import {
  calculateTimeDifference,
  StatusBadge,
  convertTime,
  mapToTargetObject,
  TroubleTicketViewModeEsclationLevel,
} from "@/core/helpers/utils";
import { troubleTicketActions } from "@/store/enums/trouble-ticket-enum";
import { swalConfirmation, swalSuccess } from "@/core/helpers/sweetAlert.utils";
import { TroubleTicketPriorityBadge, disableDates } from "@/core/helpers/utils";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import moment from "moment";
import TroubleTicketResolutionModal from "../modals/TroubleTicketResolutionModal.vue";
import TroubleTicketRCAModal from "../modals/TroubleTicketRCAModal.vue";
import ToubleTicketPauseModal from "../modals/ToubleTicketPauseModal.vue";
import TroubleTicketCancelModal from "../modals/TroubleTicketCancelModal.vue";
import PriorityDropDown from "@/components/shared/dropdowns/PriorityDropDown.vue";
import { permissions } from "@/constants/permissions-constants";

interface Tat {
  tat_start_time: Date | null;
  tat_end_time: Date | null;
  tat: number | null;
  tatType: string;
}

export default defineComponent({
  components: {
    Form,
    DividerWithText,
    DocumentsTable,
    basicTextInput,
    CategoryDropDown,
    SubCategoryDropDown,
    SubDepartmentEngineeringDropDown,
    EmployeeDropDown,
    PriorityDropDown,
    DocumentsUploader,
    TroubleTicketResolutionModal,
    TroubleTicketCancelModal,
    TroubleTicketRCAModal,
    TroubleTicketActionButtons,
    ToubleTicketPauseModal,
  },
  props: {
    isEditable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["refreshTroubleTicket"],
  setup(props, { emit }) {
    const store = useStore();
    const categoryId = ref<number>();
    const tatData = reactive<Tat>({
      tat_start_time: null,
      tat_end_time: null,
      tat: null,
      tatType: "",
    });
    const isAssignedChanged = ref(false);
    const isReOpened = ref(false);
    const isRCAAwaited = ref(false);
    const isRCAAwaitedValidate = ref(false);
    const isRCASubmitting = ref(false);
    const payloadType = ref("");
    let data = {};
    const buttonLoadingStatus = ref<string | null>(null);
    const resolveTempPayload = ref<object>({});
    const pauseApproveTempPayload = ref<object>({});
    const resolutionModal = ref<boolean>(false);
    const cancelationModal = ref<boolean>(false);
    const pauseModal = ref<boolean>(false);
    const rcaRequiredTempPayload = ref<object>({});
    const rcaRequiredModal = ref<boolean>(false);
    const userInfo = computed(() => {
      const { id, sub_department_id } = store.getters.currentUser;
      return { id, sub_department_id };
    });
    const stepperData = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getStepper`]
    );
    const resolvedStatusId =
      TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RESOLVED;

    const completedStatusId =
      TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED;

    const ticketData = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getTicketData`]
    );
    const attachmentslist = computed(() => ticketData?.value?.attachment);

    const validationSchema = computed(() => {
      const val = createYupValidationSchema({
        comment: yup.string().nullable().required("Comment is required"),
        sub_department_id: yup
          .number()
          .nullable()
          .required("Sub-Department is required"),
        rca_reason:
          (isRCASubmitting.value || isRCAAwaitedValidate.value) &&
          yup.string().nullable().required("Root Cause is required"),
        corrective_action:
          (isRCASubmitting.value || isRCAAwaitedValidate.value) &&
          yup.string().nullable().required("Corrective Action is required"),
        preventive_step:
          (isRCASubmitting.value || isRCAAwaitedValidate.value) &&
          yup.string().nullable().required("Preventive Measures is required"),
        rca_start_time:
          (isRCASubmitting.value || isRCAAwaitedValidate.value) &&
          yup
            .date()
            .nullable()
            .max(new Date(), "Start Date must be before than Current Date")
            .required("Start Date is required"),
        rca_end_time:
          (isRCASubmitting.value || isRCAAwaitedValidate.value) &&
          yup
            .date()
            .nullable()
            .min(
              new Date(values.rca_start_time!),
              "End Date must be later than Start Date"
            )
            .max(new Date(), "End Date must be before than Current Date")
            .required("End Date is required"),
        // assigned_to_id: yup.number().nullable().required("Worker is required"),
      });

      return val;
    });

    const {
      handleSubmit,
      errors,
      resetForm,
      values,
      setFieldValue,
      handleReset,
      validate,
    } = useForm<UpdateTroubleTicket>({
      validationSchema: validationSchema,
      initialValues: {
        ...UpdateTroubleTicketModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(UpdateTroubleTicketModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    onMounted(() => {
      setFieldValue("priority_level", ticketData?.value?.priorityLevel?.id);
      Object.assign(tatData, {
        tat: ticketData?.value?.total_tat,
        tatType: ticketData?.value?.tat_uom,
        tat_start_time: ticketData?.value?.tat_start_time,
        tat_end_time: ticketData?.value?.tat_end_time,
      });
      setFieldValue(
        "trouble_ticket_category_id",
        ticketData?.value?.trouble_ticket_category_id
      );
      setFieldValue(
        "trouble_ticket_sub_category_id",
        ticketData?.value?.trouble_ticket_sub_category_id
      );
      setFieldValue("sub_department_id", ticketData?.value?.sub_department_id);
      setFieldValue("assigned_to_id", ticketData?.value?.assigned_to_id);
    });

    const reOpenFlowCheck = (type?: string) => {
      if (isReOpened.value) {
        buttonStatusCheck(type);
      } else {
        isReOpened.value = true;
        setFieldValue("sub_department_id", null);
        setFieldValue("assigned_to_id", null);
      }
    };

    const isReOpenedCancel = () => {
      isReOpened.value = false;
      isAssignedChanged.value = false;
      setFieldValue("sub_department_id", ticketData?.value?.sub_department_id);
      setFieldValue("assigned_to_id", ticketData?.value?.assigned_to_id);
    };

    const buttonStatusCheck = (type?: string) => {
      isRCASubmitting.value = false;
      isRCAAwaitedValidate.value = false;
      data = {};
      switch (type) {
        case TroubleTicketContants.BUTTON_STATUS.LEAVE:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.LEAVE;
          Object.assign(data, LeaveTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.CANCEL:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.CANCEL;
          Object.assign(data, CancelTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.SEND_BACK:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.SEND_BACK;
          Object.assign(data, SendBackTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.RE_OPEN:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.RE_OPEN;
          Object.assign(data, ReopenTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.UPDATE:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.UPDATE;
          if (ticketData?.value?.permissions?.can_assign_ticket) {
            Object.assign(data, CanAssignTicketModel);
          } else {
            Object.assign(data, UpdateTicketModel);
          }
          break;
        case TroubleTicketContants.BUTTON_STATUS.RCA_REQUIRED:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.RCA_REQUIRED;
          Object.assign(data, RCARequiredTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.RCA_SUBMIT:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.RCA_SUBMIT;
          Object.assign(data, RCATicketModel);
          isRCASubmitting.value = true;
          break;
        case TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_APPROVE:
          payloadType.value =
            TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_APPROVE;
          Object.assign(data, PauseRequestApproveTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_CANCEL:
          payloadType.value =
            TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_CANCEL;
          Object.assign(data, CancelPauseRequestTicketModel);
          break;
        case TroubleTicketContants.BUTTON_STATUS.RESOLVE:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.RESOLVE;
          if (!isRCAAwaited.value) {
            isRCAAwaitedValidate.value = true;
            Object.assign(data, {
              ...ResolvedTicketModel,
              ...RCATicketModel,
            });
          } else {
            Object.assign(data, ResolvedTicketModel);
          }
          break;
        case TroubleTicketContants.BUTTON_STATUS.COMPLETE:
          payloadType.value = TroubleTicketContants.BUTTON_STATUS.COMPLETE;
          Object.assign(data, CompletedTicketModel);
          break;
      }

      onSubmit();
    };

    const onSubmit = handleSubmit(async (val: any) => {
      const payload = mapToTargetObject(data, val);

      try {
        switch (payloadType.value) {
          case TroubleTicketContants.BUTTON_STATUS.LEAVE:
            swalConfirmation("Are you sure to leave this ticket?", async () => {
              buttonLoadingStatus.value =
                TroubleTicketContants.BUTTON_STATUS.LEAVE;
              leaveTicket(payload);
            });
            break;
          case TroubleTicketContants.BUTTON_STATUS.CANCEL:
            cancelationModal.value = true;
            break;
          case TroubleTicketContants.BUTTON_STATUS.SEND_BACK:
            swalConfirmation(
              "Are you sure to send back this ticket?",
              async () => {
                buttonLoadingStatus.value =
                  TroubleTicketContants.BUTTON_STATUS.SEND_BACK;
                sendBackTicket(payload);
              }
            );
            break;
          case TroubleTicketContants.BUTTON_STATUS.RE_OPEN:
            swalConfirmation(
              "Are you sure to Re-Open this ticket?",
              async () => {
                buttonLoadingStatus.value =
                  TroubleTicketContants.BUTTON_STATUS.RE_OPEN;
                reOpenTicket(payload);
              }
            );
            break;
          case TroubleTicketContants.BUTTON_STATUS.UPDATE:
            if (isAssignedChanged.value) {
              swalConfirmation(
                "Are you sure to change worker assignment?",
                async () => {
                  try {
                    buttonLoadingStatus.value =
                      TroubleTicketContants.BUTTON_STATUS.UPDATE;
                    await updateTicket(payload);
                    emit("refreshTroubleTicket");
                  } catch (error) {
                    console.log(error);
                  } finally {
                    buttonLoadingStatus.value = null;
                  }
                }
              );
            } else {
              buttonLoadingStatus.value =
                TroubleTicketContants.BUTTON_STATUS.UPDATE;
              await updateTicket(payload);
              emit("refreshTroubleTicket");
            }
            break;
          case TroubleTicketContants.BUTTON_STATUS.RESOLVE:
            payload["status"] = resolvedStatusId;
            resolveTempPayload.value = payload;
            resolutionModal.value = true;
            break;
          case TroubleTicketContants.BUTTON_STATUS.RCA_REQUIRED:
            rcaRequiredTempPayload.value = payload;
            rcaRequiredModal.value = true;
            break;
          case TroubleTicketContants.BUTTON_STATUS.RCA_SUBMIT:
            swalConfirmation("Are you sure to Submit RCA?", async () => {
              buttonLoadingStatus.value =
                TroubleTicketContants.BUTTON_STATUS.RCA_SUBMIT;
              rcaSubmitTicket(payload);
            });
            break;
          case TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_APPROVE:
            pauseApproveTempPayload.value = {
              currentPauseData: ticketData.value?.currentTicketPause,
              comment: payload["comment"],
            };
            pauseModal.value = true;
            break;
          case TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_CANCEL:
            swalConfirmation(
              "Are you sure you want to reject this ticket pause request?",
              async () => {
                buttonLoadingStatus.value =
                  TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_CANCEL;
                await cancelPauseRequestTicket(payload);
                router.replace({ name: "trouble-ticket-list" });
              }
            );
            break;
          case TroubleTicketContants.BUTTON_STATUS.COMPLETE:
            swalConfirmation(
              "Are you sure that the process for this issue is completed?",
              async () => {
                payload["status"] = completedStatusId;
                buttonLoadingStatus.value =
                  TroubleTicketContants.BUTTON_STATUS.COMPLETE;
                const res = await updateTicket(payload);
                swalSuccess(
                  "Ticket Completed",
                  `Ticket '${
                    res?.data?.ticket_number
                  }' took ${await convertTime(
                    Number(res?.data?.completed_time)
                  )} to complete.'`,
                  null,
                  () => {
                    router.replace({ name: "trouble-ticket-list" });
                  }
                );
              }
            );
            break;
        }
      } catch (error) {
        console.log(error);
      } finally {
        buttonLoadingStatus.value = null;
      }
    });

    const onPriorityChange = async (data) => {
      const res = await TroubleTicketService.setTroubleTicketPriority(
        ticketData.value.id,
        { priority_level: data.value }
      );
      ElNotificationSuccess(res.message);
    };

    const uploadingStatus = (val) => {
      if (val) {
        buttonLoadingStatus.value = "Uploading";
      } else {
        buttonLoadingStatus.value = null;
      }
    };

    const leaveTicket = async (payload) => {
      const res = await TroubleTicketService.leaveTicket(
        ticketData.value.id,
        payload
      );
      ElNotificationSuccess(res.message);
      router.replace({ name: "trouble-ticket-list" });
    };

    const sendBackTicket = async (payload) => {
      const res = await TroubleTicketService.sendBackTicket(
        ticketData.value.id,
        payload
      );
      ElNotificationSuccess(res.message);
      router.replace({ name: "trouble-ticket-list" });
    };

    const resolveTicket = async (payload) => {
      let newPayload = {};
      if (isRCAAwaited.value) {
        newPayload = { ...payload, is_rca_awaited: isRCAAwaited.value };
      } else {
        Object.assign(newPayload, {
          status: payload.status,
          attachment: payload.attachment,
          comment: payload.comment,
          resolution_comment: payload.resolution_comment,
          resolution_reason: payload.resolution_reason,
          rca: {
            rca_start_time: payload.rca_start_time,
            rca_end_time: payload.rca_end_time,
            rca_reason: payload.rca_reason,
            corrective_action: payload.corrective_action,
            preventive_step: payload.preventive_step,
          },
        });
      }
      try {
        swalConfirmation(
          "Are you sure that the process for this issue is resolved?",
          async () => {
            resolutionModal.value = false;
            buttonLoadingStatus.value =
              TroubleTicketContants.BUTTON_STATUS.RESOLVE;
            const res = await updateTicket(newPayload);
            swalSuccess(
              "Ticket Resolved",
              `Ticket '${res?.data?.ticket_number}' took ${await convertTime(
                Number(res?.data?.resolved_time)
              )} to resolve.'`,
              null,
              () => {
                if (!isRCAAwaited.value) {
                  router.replace({ name: "trouble-ticket-list" });
                } else {
                  emit("refreshTroubleTicket");
                }
              }
            );
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        buttonLoadingStatus.value = null;
      }
    };

    const rcaRequiredTicket = async (payload) => {
      swalConfirmation(
        `Are you sure you want to assign ticket to ${payload?.subDepName} for RCA?`,
        async () => {
          try {
            delete payload["subDepName"];
            rcaRequiredModal.value = false;
            buttonLoadingStatus.value =
              TroubleTicketContants.BUTTON_STATUS.RCA_REQUIRED;
            const res = await updateTicket(payload);
            router.replace({ name: "trouble-ticket-list" });
            buttonLoadingStatus.value = null;
          } catch (error) {
            buttonLoadingStatus.value = null;
          }
        }
      );
    };

    const rcaSubmitTicket = async (payload) => {
      try {
        const res = await TroubleTicketService.rcaSubmitTicket(
          ticketData.value.id,
          payload
        );
        router.replace({ name: "trouble-ticket-list" });
      } catch (error) {
        console.log(error);
      } finally {
        buttonLoadingStatus.value = null;
      }
    };

    const pauseTicket = async (payload) => {
      try {
        swalConfirmation(
          ticketData.value.permissions?.can_pause
            ? `Are you sure you want to pause this ticket for ${payload?.duration}?`
            : `Are you sure you want to approve this ticket pause request for ${payload?.duration}?`,
          async () => {
            delete payload["duration"];
            pauseModal.value = false;
            if (ticketData.value.permissions?.can_pause) {
              buttonLoadingStatus.value =
                TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST;
              const res = await TroubleTicketService.pauseRequestTicket({
                id: ticketData.value.id,
                ...payload,
              });
              ElNotificationSuccess(res.message);
            } else if (ticketData.value.permissions?.can_approve_pause) {
              buttonLoadingStatus.value =
                TroubleTicketContants.BUTTON_STATUS.PAUSE_REQUEST_APPROVE;
              const res = await TroubleTicketService.pauseRequestApproveTicket(
                ticketData.value?.current_pause_id,
                { ticketId: ticketData.value.id, ...payload }
              );
              ElNotificationSuccess(res.message);
            }
            await store.dispatch(
              `${ModuleName.troubleTicket}/${troubleTicketActions.GET_TROUBLE_TICKET}`,
              ticketData.value.id
            );
            emit("refreshTroubleTicket");
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        buttonLoadingStatus.value = null;
      }
    };

    const cancelPauseRequestTicket = async (payload) => {
      const res = await TroubleTicketService.cancelPauseRequestTicket(
        ticketData.value?.current_pause_id,
        { ticketId: ticketData.value.id, ...payload }
      );
      ElNotificationSuccess(res.message);
      return;
    };

    const reOpenTicket = async (payload) => {
      const res = await TroubleTicketService.reOpenTicket(
        ticketData.value.id,
        payload
      );
      ElNotificationSuccess(res.message);
      router.replace({ name: "trouble-ticket-list" });
    };

    const updateTicket = async (payload) => {
      const res = await TroubleTicketService.updateTicket(
        ticketData.value.id,
        payload
      );
      await store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_TROUBLE_TICKET}`,
        ticketData.value.id
      );
      ElNotificationSuccess(res.message);
      return res;
    };

    const cancelTicket = async (payload) => {
      swalConfirmation("Are you sure to cancel this ticket?", async () => {
        try {
          cancelationModal.value = false;
          buttonLoadingStatus.value =
            TroubleTicketContants.BUTTON_STATUS.CANCEL;
          const res = await TroubleTicketService.cancelTicket(
            ticketData.value.id,
            payload
          );
          ElNotificationSuccess(res.message);
          buttonLoadingStatus.value = null;
          router.replace({ name: "trouble-ticket-list" });
        } catch (error) {
          console.log(error);
        } finally {
          buttonLoadingStatus.value = null;
        }
      });
    };

    const getTat = async () => {
      try {
        const res = await TroubleTicketService.getCategoryTurnAroundTime(
          Number(categoryId.value)
        );
        Object.assign(tatData, res);
      } catch (error) {
        console.log(error);
      }
    };

    watch(
      () => categoryId.value,
      (val) => {
        if (val) {
          getTat();
        }
      }
    );

    return {
      ticketData,
      userInfo,
      tatData,
      categoryId,
      isAssignedChanged,
      isReOpened,
      cancelTicket,
      attachmentslist,
      resolutionModal,
      cancelationModal,
      resolveTempPayload,
      rcaRequiredModal,
      rcaRequiredTempPayload,
      pauseApproveTempPayload,
      isRCAAwaited,
      resolveTicket,
      rcaRequiredTicket,
      disableDates,
      uploadingStatus,
      pauseModal,
      pauseTicket,
      errors,
      values,
      formUseFields,
      validate,
      // assignedIdField,
      buttonStatusCheck,
      reOpenFlowCheck,
      isReOpenedCancel,
      buttonLoadingStatus,
      onSubmit,
      onPriorityChange,
      TroubleTicketPriorityBadge,
      StatusBadge,
      TroubleTicketViewModeEsclationLevel,
      troubleTicketCreatePermission: permissions.troubleTicket.create,
      cancelledId: TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED,
      completeId: TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED,
      DATETIME_FOR_FROM_TO_SELECTOR:
        AppConstants.DATE_FORMATS.DATETIME_FOR_FROM_TO_SELECTOR,
    };
  },
});
</script>
