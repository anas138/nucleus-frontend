import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import {
  dashboardActions,
  dashboardMutations,
} from "@/store/enums/dashboard-enum";
import {
  DashboardList,
  MainMenuList,
} from "@/core/interface/dashboard-data-interface";
import MainMenuConfig from "@/core/config/MainMenuConfig";
import { pagesObject } from "@/core/helpers/utils";
import { getDashboardListData } from "@/core/services/CustomAppDashboardService";
import _ from "lodash";
import { PermissionsService } from "@/core/services/PermissionsService";

@Module({
  namespaced: true,
})
export default class DashboardModule extends VuexModule {
  listMainMenu = _.cloneDeep(MainMenuConfig) as MainMenuList[];
  defaultDashboard = { key: 0, label: "Default Dashboard" };
  dashboardDrawerList = [{ ...this.defaultDashboard }] as DashboardList[];

  get getDashboardlist() {
    return this.listMainMenu;
  }

  get getDashboardDrawerList() {
    return this.dashboardDrawerList;
  }

  @Mutation
  [dashboardMutations.SET_DASHBOARD_LIST](data) {
    if (data.length) {
      delete this.listMainMenu[0].pages[0].heading;
      this.listMainMenu[0].pages[0].sectionTitle = "Dashboards";
      this.dashboardDrawerList = [
        { ...this.defaultDashboard },
        ...data.map((val) => {
          return { key: val.id, label: val.name };
        }),
      ];
      const res = data.map((val) => {
        return pagesObject(val);
      });
      this.listMainMenu[0].pages[0].sub = [
        { ...this.listMainMenu[0]?.pages[0].sub[0] },
        ...res,
      ];
    } else {
      this.listMainMenu[0].pages[0].heading = "Dashboards";
      this.listMainMenu[0].pages[0].sectionTitle &&
        delete this.listMainMenu[0].pages[0].sectionTitle;
      this.listMainMenu[0].pages[0].sub = [
        { ...this.listMainMenu[0]?.pages[0].sub[0] },
      ];
      this.dashboardDrawerList = [];
    }
  }

  @Action
  async [dashboardActions.GET_ALL_DASHBOARDS]() {
    const res = await getDashboardListData();
    // const filterData = [] as any;
    if (res.length) {
      // for (let i = 0; i < res.length; i++) {
      //   if (await PermissionsService.permissionChecker(res[i].network_type)) {
      //     filterData.push(res[i]);
      //   }
      // }

      this.context.commit(dashboardMutations.SET_DASHBOARD_LIST, res);
    } else {
      this.context.commit(dashboardMutations.SET_DASHBOARD_LIST, []);
    }
  }
}
