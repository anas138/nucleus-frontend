import objectPath from "object-path";
import merge from "deepmerge";
import layoutConfig from "@/core/config/DefaultLayoutConfig";
import { Mutations } from "@/store/enums/StoreEnums";
import { Mutation, Module, VuexModule } from "vuex-module-decorators";
import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

interface StoreInfo {
  config: LayoutConfigTypes;
  initial: LayoutConfigTypes;
}

@Module
export default class ConfigModule extends VuexModule implements StoreInfo {
  config: LayoutConfigTypes = layoutConfig;
  initial: LayoutConfigTypes = layoutConfig;
  appVersion = process.env.APP_VERSION;
  appVersionDB!: string;

  /**
   * Get config from layout config
   * @returns {function(path, defaultValue): *}
   */
  get layoutConfig() {
    return (path, defaultValue) => {
      return objectPath.get(this.config, path, defaultValue);
    };
  }

  get getAppVersion() {
    return this.appVersion;
  }

  get getAppVersionDB() {
    return this.appVersionDB;
  }

  get checkUpdateRequired() {
    return this.appVersion !== this.appVersionDB;
  }

  @Mutation
  [Mutations.SET_APP_VERSION](payload): void {
    this.appVersion = payload;
  }
  @Mutation
  [Mutations.SET_APP_VERSION_DB](payload): void {
    this.appVersionDB = payload;
  }

  @Mutation
  [Mutations.SET_SIDEBAR_MINIMIZE](payload: boolean) {
    this.config.sidebar.default.minimize.desktop.default = payload;
    localStorage.setItem("config", JSON.stringify(this.config));
  }

  @Mutation
  [Mutations.SET_LAYOUT_CONFIG_PROPERTY](payload): void {
    const { property, value } = payload;
    objectPath.set(this.config, property, value);
    localStorage.setItem("config", JSON.stringify(this.config));
  }

  @Mutation
  [Mutations.RESET_LAYOUT_CONFIG]() {
    this.config = Object.assign({}, this.initial);
  }

  @Mutation
  [Mutations.OVERRIDE_LAYOUT_CONFIG](): void {
    this.config = this.initial = Object.assign(
      {},
      this.initial,
      JSON.parse(window.localStorage.getItem("config") || "{}")
    );
  }

  @Mutation
  [Mutations.OVERRIDE_PAGE_LAYOUT_CONFIG](payload): void {
    this.config = merge(this.config, payload);
  }
}
