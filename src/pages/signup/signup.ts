import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { HomePage } from '../home/home';
import { SigninPage } from '../signin/signin';

import { AuthResponse } from "../../models/auth-response.models";
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { AuthCredential } from "../../models/auth-credential.models";

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
	providers: [WordpressClient]
})

export class SignupPage {
	private loading: Loading;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private registerRequest: RegisterRequest = new RegisterRequest('', '', '');
	private registerRequestPasswordConfirm: string = '';

	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

	}

	register() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (this.registerRequest.username.length < 4) {
			this.showToast('Enter username atleast 4 char long');
		} else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
			this.showToast('Enter valid email address');
		} else if (this.registerRequest.password.length == 0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
			this.showToast('Enter valid passwords, twice.');
		} else {
			this.presentLoading('Registering user');
			let subscription: Subscription = this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.registerRequest).subscribe(data => {
				let registerResponse: RegisterResponse = data;
				this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
			}, err => {
				this.dismissLoading();
				this.presentErrorAlert("Unable to register with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
	}

	private signIn(userId: string, username: string, password: string) {
		let credentials: AuthCredential = new AuthCredential(username, password);
		let subscription: Subscription = this.service.getAuthToken(credentials).subscribe(data => {
			let authResponse: AuthResponse = data;
			window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
			this.getUser(userId);
		}, err => {
			this.dismissLoading();
			this.presentErrorAlert("Unable to login with provided credentials");
		});
		this.subscriptions.push(subscription);
	}

	private getUser(userId: string) {
		let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
			this.dismissLoading();
			let userResponse: UserResponse = data;
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
			this.navCtrl.setRoot(HomePage);
		}, err => {
			this.dismissLoading();
			this.presentErrorAlert("Unable to login with provided credentials");
		});
		this.subscriptions.push(subscription);
	}

	private presentLoading(message: string) {
		this.loading = this.loadingCtrl.create({
			content: message
		});

		this.loading.onDidDismiss(() => { });

		this.loading.present();
		this.loadingShown = true;
	}

	private dismissLoading() {
		if (this.loadingShown) {
			this.loadingShown = false;
			this.loading.dismiss();
		}
	}

	private presentErrorAlert(msg: string) {
		let alert = this.alertCtrl.create({
			title: 'Error',
			subTitle: msg,
			buttons: ['Dismiss']
		});
		alert.present();
	}

	showToast(message: string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}

	goToSignIn() {
		this.navCtrl.push(SigninPage);
	}
}
