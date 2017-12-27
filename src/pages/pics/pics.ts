import { Component } from '@angular/core';

import { ToastController, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-pics',
  templateUrl: 'pics.html'
})
export class PicsPage {

  constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
  ) { }

}
