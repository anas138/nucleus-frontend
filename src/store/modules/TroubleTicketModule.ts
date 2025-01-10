import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import {
  troubleTicketActions,
  troubleTicketMutations,
} from "../enums/trouble-ticket-enum";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { dropDownsCategory } from "@/constants/drop-down-from-server";

@Module({
  namespaced: true,
})
export default class TroubleTicketModule extends VuexModule {
  stepperdata = [];
  troubleTicket = {};
  alarmData = {};
  activityLog = [];
  commentLog = [];

  get getStepper() {
    return this.stepperdata;
  }

  get getAlarm() {
    return this.alarmData;
  }

  get getTicketData() {
    return this.troubleTicket;
  }

  get getActivityLog() {
    return this.activityLog;
  }

  get getCommentLog() {
    return this.commentLog;
  }

  @Mutation
  [troubleTicketMutations.SET_STEPPER_DATA](data) {
    this.stepperdata = data?.sort((a, b) => a.sequence - b.sequence);
  }

  @Mutation
  [troubleTicketMutations.SET_ALARM_DATA](data) {
    this.alarmData = data;
  }

  @Mutation
  [troubleTicketMutations.CLEAR_DATA]() {
    this.stepperdata = [];
    this.alarmData = {};
    this.troubleTicket = {};
    this.activityLog = [];
    this.commentLog = [];
  }

  @Mutation
  [troubleTicketMutations.SET_COMMENTS](data) {
    this.commentLog = data;
  }

  @Mutation
  [troubleTicketMutations.SET_ACTIVITY_LOG](data) {
    this.activityLog = data;
  }

  @Mutation
  [troubleTicketMutations.SET_TROUBLE_TICKET]({ ticketData, stepperdata }) {
    this.troubleTicket = ticketData;
    this.alarmData = ticketData?.alarm_detail;
    this.stepperdata = stepperdata?.sort((a, b) => a.sequence - b.sequence);
  }

  @Action
  async [troubleTicketActions.GET_STEPPER_DATA]() {
    const res: string[] = await ServerDropDownService.getDropDownFromSever(
      dropDownsCategory.TROUBLE_TICKET_STATUS
    );
    this.context.commit(troubleTicketMutations.SET_STEPPER_DATA, res);
  }

  @Action
  async [troubleTicketActions.GET_COMMENTS](id: number) {
    const res = await TroubleTicketService.getTroubleTicketCommentLog(id);
    this.context.commit(troubleTicketMutations.SET_COMMENTS, res);
  }

  @Action
  async [troubleTicketActions.GET_ACTIVITY_LOGS](id: number) {
    const res = await TroubleTicketService.getTroubleTicketActivityLog(id);
    this.context.commit(troubleTicketMutations.SET_ACTIVITY_LOG, res);
  }

  @Action
  async [troubleTicketActions.GET_TROUBLE_TICKET](id: number) {
    try {
      const [ticketData, stepperdata] = await Promise.all([
        TroubleTicketService.getTroubleTicketById(id),
        ServerDropDownService.getDropDownFromSever(
          dropDownsCategory.TROUBLE_TICKET_STATUS
        ),
      ]);
      this.context.commit(troubleTicketMutations.SET_TROUBLE_TICKET, {
        ticketData,
        stepperdata,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
