import { Component } from '@angular/core';
import { Platform, NavController, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';

import { ItemCreatePage } from '../item-create/item-create';
// import { ItemDetailPage } from '../item-detail/item-detail';

import { Vmrecords, Location, Settings } from '../../providers/providers';

import { Item } from '../../models/item';
// import { Vmrecord } from '../../models/vmrecord';

import { Geolocation } from '@ionic-native/geolocation';

declare var cordova: any;

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {

  pageTitle: string = 'Records'

  constructor(public navCtrl: NavController,
      public vmrecords: Vmrecords,
      public settings: Settings,
      protected platform : Platform,
      public modalCtrl: ModalController,
      public location: Location,
      public geolocation: Geolocation ) {
      // this.geolocation.getCurrentPosition()
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this
      .vmrecords
      .getRows();
    // this.location.startTracking();
    if (this.settings.allSettings.userid) {
      this.pageTitle = "Records (user " + this.settings.allSettings.userid + ")"
    }
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  // addItem() {
  //   let addModal = this.modalCtrl.create(ItemCreatePage);
  //   addModal.onDidDismiss(vmrecord => {
  //     if (vmrecord) {
  //       this.vmrecords.addItem(vmrecord);
  //     }
  //   })
  //   addModal.present();
  // }

  /**
   * Delete an item from the list of items.
   */
  // deleteItem(vmrecord) {
  //   this.vmrecords.del(vmrecord);
  //   // refresh
  //   // this
  //   //   .vmrecords
  //   //   .getRows();
  // }

  addRecord() {
    this.vmrecords.record = this.vmrecords.newRecord();
    // this.vmrecords.form = this.vmrecords.formBuilder.group( this.vmrecords.newRecord() )
    this.navCtrl.push(ItemCreatePage);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(vmrecord) {
    this.vmrecords.isNewRecord = false;
    // this.vmrecords.isTrackingLocation = false;
    // this.vmrecords.isTrackingAltitude = false;
    this.vmrecords.record = vmrecord;
    // this.vmrecords.form = this.vmrecords.formBuilder.group( vmrecord )
    this.navCtrl.push(ItemCreatePage, {
      // vmrecord
    });
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
}
