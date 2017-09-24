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

      console.log('Loading location form for record ' + this.vmrecords.record.id );
      

      // Watch the form for changes, and
      this.form.valueChanges.subscribe((v) => {
        // this.isReadyToSave = this.vmrecords.form.valid;
        // this.vmrecords.record = this.form.value;
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordLocationPage, Tracking: ' + this.form.value.isTrackingLocation);

    if (this.form.value.isTrackingLocation) {
      this.trackLocation();
    }
  }

  trackLocation() {
      this.form.value.isTrackingLocation = true;
      this.location.events.subscribe('locationFound', (lat, lng,accuracy) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Accuracy OK');
        this.form.get('lat').setValue(lat);
        this.form.get('long').setValue(lng);
        this.form.get('accuracy').setValue(accuracy);
        this.vmrecords.record.lat = lat;
        this.vmrecords.record.long = lng;
        this.vmrecords.record.accuracy = accuracy;
        this.updateLocation();

      });
      this.location.events.subscribe('altitudeFound', (altitude) => {
        this.form.get('altitude').setValue(altitude);
        this.vmrecords.record.altitude = altitude;
      })
  }

  stopTrackingLocation() {
    this.form.value.isTrackingLocation = false;
    this.location.events.unsubscribe('locationFound');
  }

  stopTrackingAltitude() {
    this.form.value.isTrackingLocation = false;
    this.location.events.unsubscribe('altitudeFound');
  }

  updateLocation() {
    this.location.fetchlocstr (this.form.value.lat,this.form.value.long)
      .then(s => {
        this.form.get('country').setValue(this.location.country);
        this.form.get('province').setValue(this.location.province);
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
