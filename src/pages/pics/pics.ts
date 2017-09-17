import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { Vmrecords } from '../../providers/providers';
import { Camera } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the PicsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pics',
  templateUrl: 'pics.html',
})
export class PicsPage {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public vmrecords: Vmrecords,
    public viewCtrl: ViewController,
    public camera: Camera) {

    this.form = formBuilder.group(this.vmrecords.record);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicsPage');
  }

  getPicture() {
  if (Camera['installed']()) {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 96,
      targetHeight: 96
    }).then((data) => {
      this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
    }, (err) => {
      alert('Unable to take photo');
    })
  } else {
    this.fileInput.nativeElement.click();
  }
}

done() {
  // if (!this.vmrecords.form.valid) { return; }
    this.vmrecords.record = this.form.value;
    this.vmrecords.addItem(this.form.value).then(s => {
      this.viewCtrl.dismiss(this.form.value);
    });
  // }
}

cancel() {
  this.viewCtrl.dismiss();
}

}
