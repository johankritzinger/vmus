import { Component } from '@angular/core';
import { IonicPage, ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { Vmrecords, VmprojectsProvider, Location, Connection } from '../../providers/providers';
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
        public  formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public connection: Connection,
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
      this.location.bestAcuracy = 100;
      this.form.value.isTrackingLocation = true;
      this.presentToast('Getting location');
      this.location.events.subscribe('locationFound', (lat, lng,accuracy) => {
        this.form.get('lat').setValue(lat);
        this.form.get('long').setValue(lng);
        this.form.get('accuracy').setValue(accuracy);
        this.vmrecords.record.lat = lat;
        this.vmrecords.record.long = lng;
        this.vmrecords.record.accuracy = accuracy;
        this.presentToast('updating ' + accuracy);
        this.updateLocation();
      });
      this.location.events.subscribe('altitudeFound', (altitude) => {
        this.form.get('altitude').setValue(altitude);
        this.vmrecords.record.altitude = altitude;
        this.presentToast('setting altitude');
      });
  }

  stopTrackingLocation() {
    this.form.value.isTrackingLocation = false;
    this.location.events.unsubscribe('locationFound');
  }

  changeLocTracking() {
    let set = this.form.value.isTrackingLocation;
    console.log('changeLocTracking: ' + set);
    if (set) {
      this.trackLocation();
    } else {
      this.stopTrackingLocation();
    }
  }

  changeAltTracking() {
    let set = this.form.value.isTrackingAltitude;
    this.presentToast('Checking altitude: ' + set)
    if (set) {
      this.form.value.isTrackingAltitude = true;
      this.location.events.subscribe('altitudeFound', (altitude) => {
        this.presentToast('Setting altitude');
        this.form.get('minelev').setValue(altitude);
        this.vmrecords.record.minelev = altitude;
        this.form.get('maxelev').setValue(altitude);
        this.vmrecords.record.maxelev = altitude;

      })
    } else {
      this.form.value.isTrackingAltitude = false;
      this.location.events.unsubscribe('altitudeFound');
    }
  }

  updateLocation() {
    if (this.connection.connected) {
      this.presentToast('Looking up location');
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
  }

  done() {
    // if (!this.vmrecords.form.valid) { return; }
      this.vmrecords.record = this.form.value;
      this.vmrecords.addItem(this.form.value).then(s => {
        this.viewCtrl.dismiss(this.form.value);

      });
      this.location.events.unsubscribe('altitudeFound');
      this.location.events.unsubscribe('locationFound');
    // }
  }

  cancel() {
    this.location.events.unsubscribe('altitudeFound');
    this.location.events.unsubscribe('locationFound');
    this.viewCtrl.dismiss();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
