import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Vmrecords } from '../../providers/providers';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(public navCtrl: NavController, navParams: NavParams, vmrecords: Vmrecords) {
    this.item = navParams.get('vmrecord') || vmrecords.newRecord;
  }

}
