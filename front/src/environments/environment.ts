// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /* observabilityUrl: 'https://6210a4dc4cd3049e17813289.mockapi.io/api/v1/observability' */
  observabilityUrl: 'https://api-dev.dev.heytelecom.be/api/log-events/v1/log',
  apikey: '9QERTBQ0WinGxZEuzswALIhvEZr3NaI1'
  /* observabilityUrl: 'https://obe-nonprod-dev.apigee.net/api/obe/firebase-notifier/subscribe' */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
