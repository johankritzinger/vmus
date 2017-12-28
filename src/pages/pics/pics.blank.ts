import { Component } from '@angular/core';

import { ToastController, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-pics',
  templateUrl: 'pics.html'
})
export class PicsPage {

  recordnum: number;

  constructor(public navCtrl: NavController,
        public navParams: NavParams,
  ) {
  // this.recordnum = navParams.get('recordnum');
 }

}
