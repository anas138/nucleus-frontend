import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import { IAlarmListData } from "@/core/interface/alarms-data-interface";
import { IobserviumAlert } from "@/core/interface/observium-alarm-interface";
import {
  FiltersTemplateActions,
  FiltersTemplatesMutations,
} from "../enums/StoreEnums";
import {
  IFiltersTemplate,
  IFiltersTemplateCreate,
  TemplateType,
} from "@/core/interface/filter-template-interfaces";
import FiltersTemplateService from "@/core/services/FiltersTemplatesService";
import { AppConstants } from "@/constants/app-constants";
import { ModuleName } from "../enums/module-enum";
import { AxiosResponse } from "axios";
import { IApiResponse } from "@/core/interface/api-response";
import { th } from "element-plus/es/locale";

@Module({
  namespaced: true,
})
export default class FiltersTemplateModule extends VuexModule {
  filterTemplates = {
    [AppConstants.FILTER_TEMPLATE_TYPES.OBSERVIUM]: [], //IFiltersTemplate[]
    [AppConstants.FILTER_TEMPLATE_TYPES.NCE]: [], //IFiltersTemplate[]
    [AppConstants.FILTER_TEMPLATE_TYPES.NCE_GPON]: [], //IFiltersTemplate[]
  };
  selectedTemplatesId = {
    [AppConstants.FILTER_TEMPLATE_TYPES.OBSERVIUM]: null,
    [AppConstants.FILTER_TEMPLATE_TYPES.NCE]: null,
    [AppConstants.FILTER_TEMPLATE_TYPES.NCE_GPON]: null,
  };
  clearFiltersOnFilterTemplateSelect = false;

  @Mutation
  [FiltersTemplatesMutations.SET_FILTER_TEMPLATES]({
    filterdata,
    template_type,
  }) {
    // this.filterTemplates.push(data);

    this.filterTemplates[template_type] = [...filterdata];
  }

  @Mutation
  [FiltersTemplatesMutations.SELECTED_TEMPLATE_ID]({ type, id }) {
    this.selectedTemplatesId[type] = id;
  }

  @Mutation
  [FiltersTemplatesMutations.CLEAR_FILTER_TEMPLATES]({ type }) {
    this.selectedTemplatesId[type] = null;
  }

  @Mutation
  [FiltersTemplatesMutations.CLEAR_FILTERS](payload: boolean) {
    this.clearFiltersOnFilterTemplateSelect = payload;
  }

  get getFilterTemplates() {
    return this.filterTemplates;
  }
  get getSelectedTemplatesId() {
    return this.selectedTemplatesId;
  }
  get getClearFiltersOnFilterTemplateSelect() {
    return this.clearFiltersOnFilterTemplateSelect;
  }

  @Action
  [FiltersTemplateActions.SAVE_FILTERS_TEMPLATE](data: IFiltersTemplateCreate) {
    FiltersTemplateService.createFilterTemplate(data).then(() => {
      this.context.dispatch(
        FiltersTemplateActions.Get_ALL_FILTERS_TEMPLATE,
        data.template_type
      );
    });
  }

  @Action
  [FiltersTemplateActions.Get_ALL_FILTERS_TEMPLATE](
    template_type: TemplateType
  ) {
    FiltersTemplateService.getAllFilterTemplate(template_type).then(
      (data: IFiltersTemplate[]) => {
        data = data.map((filtersTemplates: IFiltersTemplate) => {
          filtersTemplates.filters_payload = JSON.parse(
            filtersTemplates.filters_payload
          );
          return filtersTemplates;
        });

        this.context.commit(FiltersTemplatesMutations.SET_FILTER_TEMPLATES, {
          filterdata: data,
          template_type,
        });
      }
    );
  }

  @Action
  async [FiltersTemplateActions.DELETE_FILTERS_TEMPLATE]({
    id,
    template_type,
  }) {
    await FiltersTemplateService.deleteFilterTemplate(id);
    this.context.dispatch(
      FiltersTemplateActions.Get_ALL_FILTERS_TEMPLATE,
      template_type
    );
  }
}
