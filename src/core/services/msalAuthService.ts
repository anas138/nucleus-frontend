import {
  MsalLoginRequest,
  msalConfig,
  msalPublicClientApp,
} from "@/core/config/microsoftOAuthConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

let username = "";

function selectAccount() {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = msalPublicClientApp.getAllAccounts();
  if (currentAccounts.length === 0) {
    return;
  } else if (currentAccounts.length > 1) {
    // Add choose account code here
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    username = currentAccounts[0].username;
    // showWelcomeMessage(username);
  }
}

function handleResponse(response) {
  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null) {
    username = response.account.username;
    // showWelcomeMessage(username);
    console.log("user-logged-in", response);
  } else {
    selectAccount();
  }
}

function signIn(callback, errorCallback) {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  // To remove key if exist
  const itemKey = "msal.interaction.status";
  if (sessionStorage.getItem(itemKey)) {
    sessionStorage.removeItem(itemKey);
  }

  msalPublicClientApp
    .loginPopup(MsalLoginRequest)
    .then((response) => {
      console.log("user-logged-in", response);
      callback(response);
    })
    .catch((error) => {
      console.error(error.message);
      errorCallback(error);
    });
}

function signOut(callback) {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  const logoutRequest = {
    account: msalPublicClientApp.getAccountByUsername(username),
    postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    // mainWindowRedirectUri: msalConfig.auth.redirectUri
  };

  msalPublicClientApp
    .logoutPopup(logoutRequest)
    .then((resp) => {
      console.log("logout-resp", resp);
      callback();
    })
    .catch((err) => console.log("logout-error", err));
}

function getTokenPopup(Account) {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  const request = {
    scopes: ["User.Read"],
    account: Account,
    forceRefresh: true,
  };

  return msalPublicClientApp
    .acquireTokenSilent(request)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.warn(
        "silent token acquisition fails. acquiring token using popup"
      );
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalPublicClientApp
          .acquireTokenPopup(MsalLoginRequest)
          .then((tokenResponse) => {
            console.log(tokenResponse);
            return tokenResponse;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.warn(error);
      }
    });
}

// function seeProfile() {
//   getTokenPopup(loginRequest)
//     .then(response => {
//       callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
//     }).catch(error => {
//       console.error(error);
//     });
// }

// function readMail() {
//   getTokenPopup(tokenRequest)
//     .then(response => {
//       callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
//     }).catch(error => {
//       console.error(error);
//     });
// }

function isUserLoggedIn() {
  const accounts = msalPublicClientApp.getAllAccounts();
  return accounts.length > 0;
}

export default {
  selectAccount,
  signIn,
  signOut,
  isUserLoggedIn,
  getTokenPopup,
};
