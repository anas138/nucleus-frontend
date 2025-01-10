import { msalPublicClientApp } from "@/core/config/microsoftOAuthConfig";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { PermissionsService } from "@/core/services/PermissionsService";
import SocketIoService from "@/core/services/SocketIoService";
import router from "@/router";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";

interface Permissions {
  id: number;
  name: string;
}

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

export interface UserAuthInfo {
  errors: string;
  user: User;
  isAuthenticated: boolean;
}

@Module
export default class AuthModule extends VuexModule implements UserAuthInfo {
  errors = "";
  user = {} as User;
  permissions = [] as Permissions[];
  isAuthenticated = !!JwtService.getToken();
  defaultDashboardRoute = "";

  /**
   * Get current user object
   * @returns User
   */
  get currentUser(): User {
    return this.user;
  }

  /**
   * Get current user permissions object
   * @returns User
   */
  get getPermissions(): Permissions[] {
    return this.permissions;
  }

  /**
   * Verify user authentication
   * @returns boolean
   */
  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Get authentification errors
   * @returns array
   */
  get getErrors() {
    return this.errors;
  }

  get getDefaultDashboard() {
    return this.defaultDashboardRoute;
  }

  @Mutation
  [Mutations.SET_DEFAULT_DASHBOARD](route: string) {
    this.defaultDashboardRoute = route;
  }

  @Mutation
  [Mutations.SET_ERROR](error: string) {
    this.errors = error;
  }

  @Mutation
  [Mutations.SET_AUTH](user) {
    this.isAuthenticated = true;
    this.errors = "";
    this.user = user.data.user;
    JwtService.saveToken(user.data.tokens.access.token);
  }

  @Mutation
  [Mutations.SET_USER](data) {
    this.user = data.data;
  }

  @Mutation
  [Mutations.SET_PASSWORD](password) {
    this.user.password = password;
  }

  @Mutation
  [Mutations.PURGE_AUTH]() {
    this.isAuthenticated = false;
    this.user = {} as User;
    this.errors = "";
    this.permissions = [];
    JwtService.destroyToken();
    SocketIoService.disconnect();
  }
  @Mutation
  [Mutations.SET_USER_PERMISSIONS](data) {
    this.permissions = data;
  }

  @Action
  [Actions.LOGIN](credentials) {
    return ApiService.post("auth/login", credentials)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.message);
      });
  }

  @Action
  async [Actions.LOGIN_WITH_MS](payload) {
    return ApiService.post("auth/ms-login", payload)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.message);
        const accounts = msalPublicClientApp.getAllAccounts();
        // filter on the account that you want to delete from the cache.
        // I take the first one here to keep the code sample short
        const account = accounts[0];
        if (account)
          setTimeout(function () {
            msalPublicClientApp.logoutRedirect({ account });
          }, 2000);
      });
  }

  @Action
  async [Actions.LOGOUT]() {
    return ApiService.axiosInstance.post("/auth/logout").then(() => {
      this.context.commit(Mutations.PURGE_AUTH);
    });
  }

  @Action
  [Actions.REGISTER](credentials) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }

  @Action
  [Actions.FORGOT_PASSWORD](payload) {
    return ApiService.post("forgot_password", payload)
      .then(() => {
        this.context.commit(Mutations.SET_ERROR, {});
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }

  @Action
  [Actions.VERIFY_AUTH](payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("verify_token", payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_AUTH, data);
        })
        .catch(({ response }) => {
          this.context.commit(Mutations.SET_ERROR, response.data.errors);
          this.context.commit(Mutations.PURGE_AUTH);
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }
  @Action
  [Actions.GET_MY_INFO]() {
    ApiService.setHeader();
    return ApiService.get("auth", "user")
      .then((response) => {
        this.context.commit(Mutations.SET_USER, response.data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.message);
      });
  }
  @Action
  [Actions.GET_ALL_PERMISSIONS]() {
    return PermissionsService.getAllPermissions().then((response) => {
      this.context.commit(Mutations.SET_USER_PERMISSIONS, response);
    });
  }
}
