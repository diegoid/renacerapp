import { Component } from '@angular/core';
import { Loading,IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { Post } from "../../models/post.models";
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [WordpressClient]
})

export class SearchPage {
  private loading:Loading;
  private pageNo: number = 1;
  private query: string;
  private currencyIcon: string;
  private currencyText: string;
  private subscriptions: Array<Subscription> = [];
  private queryHistory = new Array<string>();
  private postsList = new Array<Post>();
  loadingShown:boolean=false;
  private cantScroll:boolean=false;
  constructor(private navParams: NavParams, public modalCtrl: ModalController,
  private toastCtrl: ToastController, public navCtrl: NavController,
  private service: WordpressClient, private loadingCtrl: LoadingController,
  private alertCtrl: AlertController) {
    this.queryHistory = service.getSearchHistory();
    // this.loadPosts();
  }

  doSearch() {
    let subscription: Subscription = this.service.postsByQuery(this.query, String(this.pageNo))
    .subscribe(data => {
      let response: Array<Post> = data;
      this.postsList = response;
    }, err => {
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

  doInfinite(infiniteScroll: any) {
    this.pageNo++;
    let subscription: Subscription = this.service.postsByQuery(this.query, String(this.pageNo))
    .subscribe(posts => {
      for (var i = 0; i < posts.length; i++) {
        this.postsList.push(posts[i]);
      }
      infiniteScroll.complete();
      if (posts.length<10) {
        this.cantScroll=true;
      }
    }, err => {
      infiniteScroll.complete();
      console.log(err);
    });
    this.subscriptions.push(subscription);
  }

  postDetailPage(post) {
    this.navCtrl.push(DetailsPage, {post:post});
  }

  clearHistory() {
    this.service.clearSearchHistory();
    this.queryHistory = new Array<string>();
  }

  search(q) {
    this.cantScroll=false;
    this.query = q;
    this.pageNo = 1;
    this.doSearch();
    this.service.addInSearchHistory(q);
    this.showToast("Searching...");
  }

  getItems(searchbar: any) {
    var q = searchbar.srcElement.value;
    if (!q) { return; }
    this.search(q);
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
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
}
