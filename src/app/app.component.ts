import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CommentPage } from '../pages/comment/comment';
//import { PasswordPage } from '../pages/password/password';
import { SigninPage } from '../pages/signin/signin';
import { DetailsPage } from '../pages/details/details';
import { NewsPage } from '../pages/news/news';

import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { UserResponse } from "../models/user-response.models";
import { Category } from "../models/category.models";
import { Constants } from "../models/constants.models";
import { OneSignal } from '@ionic-native/onesignal';
import { AppConfig, APP_CONFIG } from './app.config';
import { MySplashPage } from '../pages/mysplash/mysplash';

@Component({
	templateUrl: 'app.html',
	providers: [WordpressClient]
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any = MySplashPage;
	pages: Array<{ title: string, component: any }>;
	private subscriptions: Array<Subscription> = [];
	private categories = new Array<Category>();
	private newCategories = new Array<Category>();
	private pageNo: number = 1;
	user: UserResponse;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private events: Events, private oneSignal: OneSignal, public platform: Platform, public statusBar: StatusBar, private service: WordpressClient, public splashScreen: SplashScreen) {
		// let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
		// 	let authResponse: AuthResponse = data;
		// 	window.localStorage.setItem(Constants.ADMIN_API_KEY, authResponse.token);
		// 	console.log('auth setup success');
		// 	this.refreshCategories();
		// }, err => {
		// 	console.log('auth setup error');
		// });
		// this.subscriptions.push(subscription);

		let categories: Array<Category> = JSON.parse(window.localStorage.getItem('categoriesAll'));
		if (categories && categories.length) {
			let catParent = new Array<Category>();
			for (let cat of categories) {
				if (Number(cat.parent) == 0 && Number(cat.count) > 0) {
					catParent.push(cat);
				}
			}
			this.categories = catParent;
		}
		this.refreshCategories();
		this.initializeApp();
	}

	refreshCategories() {
		let subscription: Subscription = this.service.categories(String(this.pageNo)).subscribe(data => {
			let newCategories: Array<Category> = data;
			if (newCategories.length == 0) {
				let catParent = new Array<Category>();
				for (let cat of this.newCategories) {
					if (Number(cat.parent) == 0) {
						catParent.push(cat);
					}
				}
				this.categories = catParent;
				window.localStorage.setItem('categoriesAll', JSON.stringify(this.newCategories));
				console.log('category setup success');
				this.events.publish('category:setup');
			} else {
				this.newCategories = this.newCategories.concat(newCategories);
				this.pageNo++;
				this.refreshCategories();
			}
		}, err => {
			console.log('category setup error');
		});
		this.subscriptions.push(subscription);
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			if (this.platform.is('cordova')) {
				this.initOneSignal();
			}
		});
	}

	initOneSignal() {
		this.oneSignal.startInit(this.config.oneSignalAppiId, this.config.oneSignalGpId);
		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
		this.oneSignal.handleNotificationReceived().subscribe((data) => {
			// do something when notification is received
			console.log(data);
		});
		this.oneSignal.handleNotificationOpened().subscribe((data) => {
			// do something when a notification is opened
			let launchURL = data.notification.payload.launchURL;
			let id = launchURL.substring(launchURL.indexOf('.com/') + '.com/'.length, launchURL.length - 4)
			try {
				let number = Number(id)
				this.nav.push(DetailsPage, { id: String(number) });
			} catch (e) { console.log(JSON.stringify(e)) }
		});
		this.oneSignal.endInit();
	}

	goHome() {
		this.nav.setRoot(HomePage);
	}

	feedList(catId: string, catName: string) {
		this.nav.push(NewsPage, { catId: catId, catName: catName });
	}

}
