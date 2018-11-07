import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
	apiBase: string;
	perPage: string;
	adminUsername: string;
	adminPassword: string;
	oneSignalAppiId: string;
	oneSignalGpId: string;
	homeSliderPostsTagId: string;
}

export const BaseAppConfig: AppConfig = {
	apiBase: "http://dominateit.com/renacer/wp-json/",
	perPage: "5",
	adminUsername: "admin",
	adminPassword: "ediegote1",
	oneSignalAppiId: "",
	oneSignalGpId: "",
	homeSliderPostsTagId: ""
};