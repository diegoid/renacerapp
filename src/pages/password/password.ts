import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SigninPage } from '../signin/signin';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  home() {
    this.navCtrl.push(HomePage);
  }
  signin() {
    this.navCtrl.push(SigninPage);
  }
}
