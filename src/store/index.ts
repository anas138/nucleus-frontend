import { createStore } from "vuex";
import { config } from "vuex-module-decorators";
import createPersistedState from "vuex-persistedstate";

import AuthModule from "@/store/modules/AuthModule";
import BodyModule from "@/store/modules/BodyModule";
import ConfigModule from "@/store/modules/ConfigModule";
import ThemeModeModule from "@/store/modules/ThemeModeModule";
import ObserviumModule from "./modules/ObserviumModue";
import FiltersTemplateModule from "./modules/FiltersTemplateModule";
import NceModule from "./modules/NceModule";
import DashboardModule from "./modules/DashboardModule";
import TroubleTicketModule from "./modules/TroubleTicketModule";
import AppNotificationsModule from "./modules/AppNotificationsModule";
import FiltersModule from "./modules/FilterModule";
import NceGponModule from "./modules/NceGponModule";
import NokiaTXNModule from "./modules/NokiaTXNModule";
import LDISoftswitchEMSModule from "./modules/LDISoftswitchEMSModule";

config.rawError = true;

const store = createStore({
  modules: {
    AuthModule,
    BodyModule,
    ConfigModule,
    ThemeModeModule,
    ObserviumModule,
    NceModule,
    NceGponModule,
    NokiaTXNModule,
    LDISoftswitchEMSModule,
    FiltersModule,
    FiltersTemplateModule,
    DashboardModule,
    TroubleTicketModule,
    AppNotificationsModule,
  },
  plugins: [
    createPersistedState({
      key: "Nucleus_frontend",
      storage: window.localStorage, // or window.sessionStorage

      // add module below which you want to persist
      paths: ["AuthModule", "FiltersModule"], //
    }),
  ],
});

export default store;
