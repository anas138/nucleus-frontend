import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import { filtersMutations } from "../enums/filers-enum";
import {
  appTypeMapperByTableFilterColumnKey,
  getSeverityCellColorByAppType,
  severityMapper,
} from "@/core/helpers/utils";
@Module({
  namespaced: true,
})
export default class FiltersModule extends VuexModule {
  savedFilters = {};
  tableColumnFiltration = {};

  get getSavedFilters() {
    return this.savedFilters;
  }

  get getTableColumnFiltration() {
    return (tableFilterColumnKey) => {
      try {
        if (
          this.tableColumnFiltration[tableFilterColumnKey] &&
          this.tableColumnFiltration[tableFilterColumnKey].length
        ) {
          const appType =
            appTypeMapperByTableFilterColumnKey(tableFilterColumnKey);
          const data = [...this.tableColumnFiltration[tableFilterColumnKey]];
          if (appType && data.length) {
            const findSeverityObject = data.find(
              (item) => item.key === severityMapper(appType)
            );
            // Add this key if not exist
            if (!findSeverityObject["boxColor"]) {
              findSeverityObject["boxColor"] =
                getSeverityCellColorByAppType(appType);
            }
            return data;
          }
        }
        return this.tableColumnFiltration[tableFilterColumnKey];
      } catch (error) {
        console.log(error);
      }
    };
  }

  @Mutation
  [filtersMutations.SET_SAVE_FILTERS](data) {
    this.savedFilters[data.key] = data.value;
  }

  @Mutation
  [filtersMutations.DELETE_SAVED_FILTER](key) {
    delete this.savedFilters[key];
  }

  @Mutation
  [filtersMutations.SET_SAVE_TABLE_COLUMN_FILTRATION_KEY](data) {
    this.tableColumnFiltration[data.key] = data.value;
  }
}
