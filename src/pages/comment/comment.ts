import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
export class CommentPage {

    listcontrol: string = "comment";

  constructor(public navCtrl: NavController) {

  }

}
