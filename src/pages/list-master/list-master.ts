import { Component } from '@angular/core';
import { Platform, NavController, ModalController } from 'ionic-angular';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';

import { Items } from '../../providers/providers';
import { Vmrecords } from '../../providers/providers';

import { Item } from '../../models/item';
// import { Vmrecord } from '../../models/vmrecord';

import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  // currentRecords: Vmrecords[];
  currentRecords: any[];

  constructor(public navCtrl: NavController, public vmrecords: Vmrecords, protected platform : Platform, public modalCtrl: ModalController, public geolocation: Geolocation) {
      this.geolocation.getCurrentPosition()
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this
      .vmrecords
      .getRows()
      .then(s => {
        this.currentRecords = this.vmrecords.arr;
      });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.onDidDismiss(vmrecord => {
      if (vmrecord) {
        this.vmrecords.addItem(vmrecord);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(vmrecord) {
    this.vmrecords.del(vmrecord);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(vmrecord) {
    this.navCtrl.push(ItemCreatePage, {
      vmrecord
    });
  }
}
