import { Component, Inject } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { Post } from "../../models/post.models";

import { SigninPage } from '../signin/signin';
import { SearchPage } from '../search/search';
import { DetailsPage } from '../details/details';
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { AppConfig, APP_CONFIG } from '../../app/app.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WordpressClient]
})

export class HomePage {
	private loading:Loading;
	private pageNo: number = 1;
	private loadingShown:Boolean = false;
	
	private subscriptions:Array<Subscription> = [];
	private postsList = new Array<Post>();
	private sliderPostsList = new Array<Post>();
	
	private headerPost: Post;
	
	constructor(@Inject(APP_CONFIG) private config: AppConfig, private toastCtrl: ToastController, public navCtrl: NavController, private service:WordpressClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController, public admob: AdMobFree) {
		// if(!this.userLoggedIn()) {
		// 	navCtrl.setRoot(SigninPage);
		// } else {
		// 	this.loadPosts();
		// 	this.loadSliderPosts();
		// 	this.showBanner();
		// }
    // this.searchPage();
    this.loadPosts();
    this.loadSliderPosts();
    this.showBanner();
	}
	
	private showBanner() {
		let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      size: 'SMART_BANNER'
      //id: ca-app-pub-2805944169622067/9802139220
    }; 
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().then(() => {
        // success
    }).catch(e => console.log(e));
	}
	
	private loadSliderPosts() {
		let subscription:Subscription = this.service.postByTag(this.config.homeSliderPostsTagId, '1').subscribe(data => {
		this.sliderPostsList = data;
		this.headerPost = this.sliderPostsList[this.sliderPostsList.length - 1];
		}, err=> {
			console.log('slider loading error');
		});
		this.subscriptions.push(subscription);
	}
	
	private loadPosts() {
		let subscription:Subscription = this.service.postAll(String(this.pageNo)).subscribe(data => {
			this.postsList = data;
			this.dismissLoading();
		}, err=> {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}
	
	doInfinite(infiniteScroll:any) {
		this.pageNo++;
		let subscription:Subscription = this.service.postAll(String(this.pageNo)).subscribe(data => {
			for(let i=0; i<data.length; i++) {
				this.postsList.push(data[i]);
			}
			infiniteScroll.complete();
		}, err=> {
			infiniteScroll.complete();
			console.log(err);
			this.dismissLoading();
			//this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}
	
	private userLoggedIn(): boolean {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		console.log(user != null);
		return user != null;
	}
	
	postDetailPage(post) {
    this.navCtrl.push(DetailsPage, {post:post});
  }

  searchPage() {
    this.navCtrl.push(SearchPage);
  }
	
	private presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching feeds..'
    });

    this.loading.onDidDismiss(() => {});

    this.loading.present();
		this.loadingShown = true;
  }
	
	private dismissLoading(){
		if(this.loadingShown){
			this.loadingShown = false;
			this.loading.dismiss();
		}
	}
	
	private presentErrorAlert(msg:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
	
	showToast(message:string) {
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

}