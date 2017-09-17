import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { Vmrecords, VmprojectsProvider, Location } from '../../providers/providers';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the RecordLocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-record-location',
  templateUrl: 'record-location.html',
})
export class RecordLocationPage {

  form: FormGroup;

  constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public vmrecords: Vmrecords,
        public location: Location,
        public viewCtrl: ViewController,
        public  formBuilder: FormBuilder
    ) {

      this.form = formBuilder.group(this.vmrecords.record);

      console.log('Loading location form for record ' + this.vmrecords.record.id )

      // Watch the form for changes, and
      this.form.valueChanges.subscribe((v) => {
        // this.isReadyToSave = this.vmrecords.form.valid;
        // this.vmrecords.record = this.form.value;
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordLocationPage');
  }

  updateLocation() {
    this.location.fetchlocstr (this.form.value.lat,this.form.value.long)
      .then(s => {
        this.form.get('country').setValue(this.location.country);
        this.form.get('locality').setValue(this.location.locstr);
        // this.form.value.country = this.location.country;
        console.log('added ' + this.location.country);
        // this.form.value.locality = this.location.locstr;
      });
    this.location.fetchtownstr (this.form.value.lat,this.form.value.long)
      .then(s => {
        console.log('added town: ' + this.location.country);
        this.form.get('nearesttown').setValue(this.location.townstr);
      });
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
