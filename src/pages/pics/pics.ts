// see https://devdactic.com/ionic-2-images/

import { Component, ViewChild } from '@angular/core';
// import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
// import { ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
// import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import {  Platform, ActionSheetController, ToastController, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';

import { File } from '@ionic-native/file';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Vmrecords } from '../../providers/providers';
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
    public viewCtrl: ViewController,
    public camera: Camera,
    // private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    // public loadingCtrl: LoadingController

  ) {

    this.form = formBuilder.group(this.vmrecords.record);
  }

  public getPicture(picform,source) {
    var sourceType = this.camera.PictureSourceType.CAMERA;
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: 250,
      targetHeight: 250,
      allowEdit: false
    }
    if (source == 'CAMERA') {
      // default settings correct
    } else if (source == 'PHOTOLIBRARY') {
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      options = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        saveToPhotoAlbum: true,
        correctOrientation: true,
        targetWidth: 250,
        targetHeight: 250,
        allowEdit: true
      }
    }
    // Get the data of an image
     // this.presentToast('taking pic');
     this.camera.getPicture(options).then((imageData) => {
       this.presentToast(imageData);
       this.form.controls[picform].setValue(imageData);
     }, (err) => {
       this.presentToast('Error while selecting image.');
     });
     // this.camera.getPicture(options).then((imagePath) => {
     //   this.presentToast('pic taken');
     //   // Special handling for Android library
     //   if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
     //     this.filePath.resolveNativePath(imagePath)
     //       .then(filePath => {
     //         let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
     //         let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
     //         this.presentToast(correctPath);
     //         this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), picform);
     //       }, (err) => {
     //         this.presentToast('cannot resolve filepath');
     //       });
     //   } else {
     //     var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
     //     var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
     //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), picform);
     //   }
     // }, (err) => {
     //   this.presentToast('Error while selecting image.');
     // });
  }

  // // Create a new name for the image
  // private createFileName() {
  //   var d = new Date(),
  //   n = d.getTime(),
  //   newFileName =  n + ".jpg";
  //   this.presentToast(newFileName);
  //   return newFileName;
  //
  // }

  // Copy the image to a local folder
  // private copyFileToLocalDir(namePath, currentName, newFileName,picform) {
  //   this.presentToast('copying ' + namePath + newFileName);
  //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
  //     this.form.value[picform] = newFileName;
  //     this.presentToast('Saved pic ' + newFileName)
  //   }, error => {
  //     this.presentToast('Error while storing file.');
  //   });
  // }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // // Always get the accurate path to your apps folder
  // public pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     // this.presentToast(cordova.file.dataDirectory + img);
  //     return cordova.file.dataDirectory + img;
  //   }
  // }

  deleteImage(picform) {
    this.presentToast('Deleting file '  + this.form.value[picform]);
    this.form.controls[picform].setValue(null);
    this.file.removeFile(cordova.file.dataDirectory, this.form.value[picform]).then(success => {
      this.presentToast('File deleted');
    }, error => {
      this.presentToast('Error while deleting file.' + cordova.file.dataDirectory + this.form.value[picform]);
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PicsPage');
  // }

//   getPicture() {
//   if (Camera['installed']()) {
//     this.camera.getPicture({
//       destinationType: this.camera.DestinationType.FILE_URI,
//       // targetWidth: 96,
//       // targetHeight: 96,
//       saveToPhotoAlbum: true,
//       allowEdit: true
//     }).then((data) => {
//       console.log('pic data: ' + data)
//       // this.form.patchValue({ 'pic1': 'data:image/jpg;base64,' + data });
//       this.form.value.pic1 = data;
//     }, (err) => {
//       alert('Unable to take photo');
//     })
//   } else {
//     this.fileInput.nativeElement.click();
//   }
// }
//
// processWebImage(event) {
//   let reader = new FileReader();
//   reader.onload = (readerEvent) => {
//
//     let imageData = (readerEvent.target as any).result;
//     this.form.patchValue({ 'pic1': imageData });
//   };
//
//   reader.readAsDataURL(event.target.files[0]);
// }
//
// getProfileImageStyle() {
//   return 'url(' + this.form.controls['pic1'].value + ')'
// }

done() {
  // if (!this.vmrecords.form.valid) { return; }
    this.presentToast('saving pics: ' + this.form.value.pic1);
    this.vmrecords.record = this.form.value;
    this.vmrecords.addItem(this.form.value).then(s => {
      this.viewCtrl.dismiss(this.form.value);
    });
}

cancel() {
  this.viewCtrl.dismiss();
}

}
