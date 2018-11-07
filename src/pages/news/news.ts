import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { Post } from "../../models/post.models";
import { DetailsPage } from '../details/details';
import { Constants } from "../../models/constants.models";

@Component({
	selector: 'page-news',
	templateUrl: 'news.html',
	providers: [WordpressClient]
})
export class NewsPage {
	private catName: string;
	private loading: Loading;
	private pageNo: number = 1;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private categoriesSelected = new Array<string>();
	private postsList = new Array<Post>();

	constructor(private navParams: NavParams, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.catName = navParams.get('catName');
		this.categoriesSelected.push(navParams.get('catId'));
		this.presentLoading();
		this.loadPosts();
	}

	private loadPosts() {
		let subscription: Subscription = this.service.postByCategories(this.categoriesSelected, String(this.pageNo)).subscribe(data => {
			this.postsList = data;
			this.dismissLoading();
			if (this.postsList.length == 0) {
				this.showEmptyMessage();
			}
		}, err => {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}

	doInfinite(infiniteScroll: any) {
		this.pageNo++;
		let subscription: Subscription = this.service.postByCategories(this.categoriesSelected, String(this.pageNo)).subscribe(data => {
			for (let i = 0; i < data.length; i++) {
				this.postsList.push(data[i]);
			}
			infiniteScroll.complete();
		}, err => {
			infiniteScroll.complete();
			console.log(err);
			this.dismissLoading();
			//this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}

	private showEmptyMessage() {
		let alert = this.alertCtrl.create({
			title: 'Oops, nothing here!',
			subTitle: 'No feeds were found in category ' + this.catName,
			buttons: [{
				text: 'Okay',
				handler: () => {
					this.navCtrl.pop();
				}
			}]
		});
		alert.present();
	}

	private presentLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Fetching feeds..'
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

	postDetailPage(post) {
		this.navCtrl.push(DetailsPage, { post: post });
	}


}

