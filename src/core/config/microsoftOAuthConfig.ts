import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: String(process.env.VUE_APP_MSAL_CLIENT_ID),
    authority: String(process.env.VUE_APP_MSAL_AUTHORITY),
    redirectUri: process.env.VUE_APP_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: process.env.VUE_APP_MSAL_POST_LOGOUT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const MsalLoginRequest = {
  scopes: ["User.Read"],
  prompt: "select_account",
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const MsalTokenRequest = {
  scopes: ["User.Read", "Mail.Read"],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

export const msalPublicClientApp = new PublicClientApplication(msalConfig);
