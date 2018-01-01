// see https://devdactic.com/ionic-2-images/

// see https://ionicframework.com/docs/developer-resources/third-party-libs/

// https://www.npmjs.com/package/resize-base64
// npm install resize-base64 --save
// var  img = resizebase64(base64, maxWidth, maxHeight);

import { Component, ViewChild } from '@angular/core';
// import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
// import { ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
// import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import {  Platform, ActionSheetController, ToastController, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';

import { File } from '@ionic-native/file';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Vmrecords, VmpicsProvider, Settings } from '../../providers/providers';
import { Camera } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


declare var cordova: any;

// @IonicPage()
@Component({
  selector: 'page-pics',
  templateUrl: 'pics.html',
})
export class PicsPage {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  // lastImage: string = null;
  // loading: Loading;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public vmrecords: Vmrecords,
    public vmpics: VmpicsProvider,
    public viewCtrl: ViewController,
    public camera: Camera,
    // private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public settings: Settings,
    // public loadingCtrl: LoadingController

  ) {
    // This creates vmpics.vmPics
    // this.vmpics.getPics(this.vmrecords.record.id).then(s =>{
      this.form = formBuilder.group(this.vmpics.vmPics);
      console.log('formBuilder');
      // console.log(JSON.stringify(this.vmpics.vmPics))
    // });
    // this.form = formBuilder.group(this.vmrecords.record);
  }

  public getPicture(picform,source) {
    var sourceType = this.camera.PictureSourceType.CAMERA;
    var targetSize = this.settings.allSettings.picsize || 1000;
    var quality = this.settings.allSettings.quality || 75;
    // Create options for the Camera Dialog
    var options = {
      quality: quality,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: targetSize,
      targetHeight: targetSize,
      allowEdit: false
    }
    if (source == 'CAMERA') {
      // default settings correct
    } else if (source == 'PHOTOLIBRARY') {
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      options = {
        quality: quality,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        saveToPhotoAlbum: true,
        correctOrientation: true,
        targetWidth: targetSize,
        targetHeight: targetSize,
        allowEdit: true
      }
    }
    // Get the data of an image
     this.camera.getPicture(options).then((imageData) => {
       this.form.controls[picform].setValue(imageData);
     }, (err) => {
       this.presentToast('Error while selecting image.');
     });
     // if (picform == 'pic1') {
     //   console.log('thumbnail')
     //   options.targetWidth = 80;
     //   options.targetHeight = 80;
     //   this.camera.getPicture(options).then((imageData) => {
     //     console.log(imageData);
     //   }, (err) => {
     //     this.presentToast('Error while selecting image.');
     //   });
     // }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  deleteImage(picnum) {
    this.form.controls['pic'+picnum].setValue(null);
    this.vmpics.delPic(this.vmrecords.record.id,picnum);
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PicsPage');
  // }


done() {
  // if (!this.vmrecords.form.valid) { return; }
    //  save each of the pics using vmpics.savePic()
    for (var i = 1; i < 4; i++ ) {
      console.log('Var ' + i)
      if (this.form.value['pic' + i]) {
        this.vmpics.savePic({ RecordId: this.vmrecords.record.id, PicNum: i, Content: this.form.value['pic' + i] })
        console.log('pic' + i + 'exists' )
      }
    }
    this.viewCtrl.dismiss(this.vmrecords.record);
    // this.vmrecords.addItem(this.form.value).then(s => {
    //   this.viewCtrl.dismiss(this.form.value);
    // });
}

cancel() {
  this.viewCtrl.dismiss();
}

}
