import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { AuthCredential } from "../../models/auth-credential.models";
import { AuthResponse } from "../../models/auth-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";

import { HomePage } from '../home/home';
import { PasswordPage } from '../password/password';
import { SignupPage } from '../signup/signup';

@Component({
	selector: 'page-signin',
	templateUrl: 'signin.html',
	providers: [WordpressClient]
})
export class SigninPage {
	private loading: Loading;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private credentials: AuthCredential = new AuthCredential('', '');

	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

	}

	singIn() {
		if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
			this.showToast('Username or Password cannot be empty!');
		} else {
			this.presentLoading('Logging in');
			let subscription: Subscription = this.service.getAuthToken(this.credentials).subscribe(data => {
				let authResponse: AuthResponse = data;
				window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
				this.getUser(this.getUserIdFromToken(authResponse.token));
			}, err => {
				this.dismissLoading();
				this.presentErrorAlert("Unable to login with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
	}

	private getUser(userId: string) {
		let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
			this.dismissLoading();
			let userResponse: UserResponse = data;
      window.localStorage.removeItem("skipped");
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
			this.navCtrl.setRoot(HomePage);
		}, err => {
			this.dismissLoading();
			this.presentErrorAlert("Unable to login with provided credentials");
		});
		this.subscriptions.push(subscription);
	}

	private getUserIdFromToken(token: string): string {
		let decodedString: string = window.atob(token.split(".")[1]);
		return JSON.parse(decodedString).data.user.id;
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

  skipp(){
    window.localStorage.setItem("skipped","skipped");
    this.navCtrl.setRoot(HomePage);
  }

	password() {
		this.navCtrl.push(PasswordPage);
	}

	signUp() {
		this.navCtrl.push(SignupPage);
	}
}
