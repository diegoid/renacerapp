import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Post } from "../../models/post.models";
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
// import { AD_SIZE } from 'cordova-plugin-admob-free/admob'

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
	private post:Post;
	
	constructor(private socialSharing: SocialSharing, public navCtrl: NavController, private navParams:NavParams, public admob: AdMobFree) {
		this.post = navParams.get('post');
		if(this.post == null) {
			navCtrl.pop();
		}
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
	
	private shareFacebook(post) {
		/*
		this.socialSharing.shareViaFacebook('Found this post on NewsWoop', null, post.link).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
		*/
		this.shareMore(post);
	}
	
	private shareInstagram(post) {
		/*
		this.socialSharing.shareViaInstagram('Found this post on NewsWoop', null).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
		*/
		this.shareMore(post);
	}
	
	private shareTwitter(post) {
		/* this.socialSharing.shareViaTwitter('Found this post on NewsWoop', null, post.link).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
		*/
		this.shareMore(post);
	}
	
	private shareMore(post) {
		this.socialSharing.share('Found this post on NewsWoop', post.title.rendered, null, post.link).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
	}
}
