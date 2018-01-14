import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Vmrecords, VmprojectsProvider, Items, Location, VmpicsProvider, Settings } from '../../providers/providers';
import { RecordLocationPage } from '../record-location/record-location';
import { PicsPage } from '../pics/pics';
import 'rxjs/add/operator/filter';
import { File } from '@ionic-native/file';

/**
 * Generated class for the FormpagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var cordova: any;

// @IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html',
})
export class ItemCreatePage {

  proj: any;
  form: FormGroup;
  isReadyToSave: boolean = true ;
  isReadyToSubmit: boolean = false;
  private myData: any;
  // recordReady: boolean = false;RecordLocationPage
  // isNewRecord: boolean;
  page: string = 'main';
  pageTitle: string = 'VMUS Record'
  isTrackingLocation: boolean = false;
  private statusText: any;

  // subSettings: any = ItemCreatePage;

  // locationSettings = {
  //   page: 'location',
  //   pageTitle: 'Edit Location'
  // };

  constructor(public vmprojects: VmprojectsProvider,
    public vmrecords: Vmrecords,
    public vmpics: VmpicsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public location: Location,
    public settings: Settings,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder
  ) {
    if (!this.vmrecords.record.isTrackingLocation) {
      this.vmrecords.record.isTrackingLocation = false;
    }
    if (!this.vmrecords.record.isTrackingAltitude) {
      this.vmrecords.record.isTrackingAltitude = false;
    }
    this.vmrecords.checkReadyToSubmit();
    this.form = formBuilder.group(this.vmrecords.record);
    console.log('Loading form for record ' + this.vmrecords.record.id );

    console.log('Location tracking: ' + this.vmrecords.record.id );
    this.statusText = this.vmrecords.statusText;

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      // this.isReadyToSave = this.vmrecords.form.valid;
      // this.vmrecords.record = this.form.value;
    });
    if (this.vmrecords.checkReadyToSubmit() > 0 && this.vmrecords.record.status < 3) {
      this.isReadyToSubmit = true;
    }
  }


  openLocation() {
      let addModal = this.modalCtrl.create(RecordLocationPage);
      console.log('addModal')
      addModal.onDidDismiss(vmrecord => {
        if (vmrecord) {
         console.log('Closed location page :' + vmrecord);
         this.form = this.formBuilder.group(this.vmrecords.record);
         if (!this.form.value.isTrackingLocation) {
           this.form.value.isTrackingLocation = false;
         }
        }

      })
      addModal.present();
      // this.navCtrl.push(RecordLocationPage)
  }

  openPics() {
    this.vmpics.getPics(this.vmrecords.record.id).then(s =>{
      let addModal = this.modalCtrl.create(PicsPage);
      console.log('addModal')
      addModal.onDidDismiss(vmrecord => {
        if (vmrecord) {
         console.log('Closed pics page :' + vmrecord);
         this.form = this.formBuilder.group(this.vmrecords.record);
        }

      })
      addModal.present();
    });

  }

  openPicsNav() {
    this.navCtrl.push(PicsPage, {
      // recordnum
    });

  }

  ionViewDidLoad() {
    // Probably already tracking, just in case:
    this.location.startTracking();

    console.log('ionViewDidLoad RecordLocationPage, Tracking: ' + this.form.value.isTrackingLocation);

    if (this.form.value.isTrackingLocation) {
      this.location.events.subscribe('locationFound', (lat, lng,accuracy) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Accuracy OK');
        this.form.value.lat = lat;
        this.vmrecords.record.lat = lat;
        this.form.value.long = lng;
        this.vmrecords.record.long = lng;
        this.form.value.accuracy = accuracy;
        this.vmrecords.record.accuracy = accuracy;
        this.updateLocation();

      });
      this.location.events.subscribe('altitudeFound', (altitude) => {
        this.form.value.altitude = altitude;
      })
    }
  }

  ionViewWillEnter() {
    //
    // this.page = this.navParams.get('page') || this.page;
    if (this.settings.allSettings.userid) {
      this.pageTitle = "VMUS Record (user " + this.settings.allSettings.userid + ")"
    }
    // this.pageTitle = this.navParams.get('pageTitle');
  }

  // processWebImage(event) {
  //   let reader = new FileReader();
  //   reader.onload = (readerEvent) => {
  //
  //     let imageData = (readerEvent.target as any).result;
  //     this.vmrecords.form.patchValue({ 'profilePic': imageData });
  //   };
  //
  //   reader.readAsDataURL(event.target.files[0]);
  // }

  getProfileImageStyle() {
    return 'url(' + this.vmrecords.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.vmpics.removeOrphans();
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    // if (!this.vmrecords.form.valid) { return; }
    // if (this.form.value.id && this.form.value.id != this.vmrecords.nextid) {
    //   console.log('updating record ' + this.form.value.id);
    //   this.vmrecords.update(this.form.value).then(s => {
    //     this.viewCtrl.dismiss(this.form.value);
    //   });
    // } else {
    //   console.log('adding record ' + this.form.value.id);
      this.vmrecords.record = this.form.value;
      this.vmrecords.addItem(this.vmrecords.record).then(s => {
        this.viewCtrl.dismiss(this.form.value);
      });
    // }
  }

  updateLocation() {
    // similar to record-location, but also update the record
    this.location.fetchlocstr (this.form.value.lat,this.form.value.long)
      .then(s => {
        this.form.get('country').setValue(this.location.country);
        this.form.get('province').setValue(this.location.province);
        this.vmrecords.record.country = this.location.country;
        this.form.get('locality').setValue(this.location.locstr);
        this.vmrecords.record.locality = this.location.locstr;
        // this.form.value.country = this.location.country;
        console.log('added ' + this.location.country);
        // this.form.value.locality = this.location.locstr;
      });
    this.location.fetchtownstr (this.form.value.lat,this.form.value.long)
      .then(s => {
        console.log('added town: ' + this.location.townstr );
        this.form.get('nearesttown').setValue(this.location.townstr);
        this.vmrecords.record.nearesttown = this.location.townstr;
      });
  }

  deleteItem(vmrecord) {
    this.vmrecords.del(this.form.value);
    this.vmpics.delRecordPics(this.form.value.id);
    this.viewCtrl.dismiss();
  }

  submitRecord() {
    // Submit to ADU
    console.log('submitting')
    if (this.vmrecords.checkReadyToSubmit() > 0 && this.vmrecords.record.status < 3 ) {
      this.vmrecords.record = this.form.value;
      this.vmrecords.addItem(this.vmrecords.record).then(s => {
        this.vmrecords.submitRecordToADU();
        this.viewCtrl.dismiss(this.form.value);
      });
    } else {
      this.presentToast("Not ready to submit this record")
    }
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
