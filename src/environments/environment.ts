// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	firebase: {
		apiKey: "AIzaSyBljB_Xo7WNymFihDf0GCTDpy2wFMHdCqg",
		authDomain: "matbactivity.firebaseapp.com",
		databaseURL: "https://matbactivity.firebaseio.com",
		projectId: "matbactivity",
		storageBucket: "matbactivity.appspot.com",
		messagingSenderId: "1017121160583",
		appId: "1:1017121160583:web:6f1b1a1d03a03b0a37e722",
		measurementId: "G-J5C20QVC69"
	},
	protocolHTTP: "http://",
	protocolWebSocket: "ws://",
	serverAPI: "localhost",
	portWebSocket: "3000",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
