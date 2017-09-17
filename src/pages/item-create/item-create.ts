import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Vmrecords, VmprojectsProvider, Items, Location } from '../../providers/providers';
import { RecordLocationPage } from '../record-location/record-location';
import 'rxjs/add/operator/filter';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the FormpagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html',
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  proj: any;
  form: FormGroup;
  isReadyToSave: boolean = true ;
  private myData: any;
  // recordReady: boolean = false;
  // isNewRecord: boolean;
  page: string = 'main';
  pageTitle: string = 'VMUS Record'

  // subSettings: any = ItemCreatePage;

  // locationSettings = {
  //   page: 'location',
  //   pageTitle: 'Edit Location'
  // };

  constructor(public vmprojects: VmprojectsProvider,
    public vmrecords: Vmrecords,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public location: Location,
    public formBuilder: FormBuilder,
    public camera: Camera
  ) {
    this.form = formBuilder.group(this.vmrecords.record)

    console.log('Loading form for record ' + this.vmrecords.record.id )

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      // this.isReadyToSave = this.vmrecords.form.valid;
      // this.vmrecords.record = this.form.value;
    });

    if (this.vmrecords.isNewRecord) {
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
      // !!! need to add watch for altitude

    }


  }


  openLocation() {
      let addModal = this.modalCtrl.create(RecordLocationPage);
      console.log('addModal')
      addModal.onDidDismiss(vmrecord => {
        if (vmrecord) {
         console.log('Closed location page :' + vmrecord);
         this.form = this.formBuilder.group(this.vmrecords.record);
        }

      })
      addModal.present();
      // this.navCtrl.push(RecordLocationPage)

  }

  ionViewDidLoad() {
    // Probably already tracking, just in case:
    this.location.startTracking();
  }

  ionViewWillEnter() {
    //
    // this.page = this.navParams.get('page') || this.page;
    // this.pageTitle = this.navParams.get('pageTitle');
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

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.vmrecords.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.vmrecords.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
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
    this.viewCtrl.dismiss();
  }

}
