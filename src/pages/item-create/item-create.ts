import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Vmrecords } from '../../providers/providers';
// import { Camera } from '@ionic-native/camera';

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
  isReadyToSave: boolean;
  private myData: any;

  constructor(public vmrecords: Vmrecords, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder) {
    // this.proj = navParams.get('proj');

    this.form = formBuilder.group({
      email: ['', Validators.required],
      observers: [''],
      country: [''],
      // project: [this.proj.Project_acronym, Validators.required],
      project: ['',Validators.required],
      province: [''],
      nearesttown: [''],
      locality: [''],
      minelev: [''],
      maxelev: [''],
      lat: [''],
      long: [''],
      datum: [''],
      accuracy: [''],
      source: [''],
      year: [''],
      month: [''],
      day: [''],
      note: [''],
      userdet: [''],
      nestcount: [''],
      nestsite: [''],
      roadkill: ['']

    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormpagePage ' + this.proj.Project_acronym);
  }

  onSubmit(formData) {
    this
      .vmrecords
      .getRows()
      .then(s => {
        this.vmrecords.addItem(formData);
      });
    console.log('Form data is ', formData);
    this.myData = formData;
  }

//   getPicture() {
//   if (Camera['installed']()) {
//     this.camera.getPicture({
//       destinationType: this.camera.DestinationType.DATA_URL,
//       targetWidth: 96,
//       targetHeight: 96
//     }).then((data) => {
//       this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
//     }, (err) => {
//       alert('Unable to take photo');
//     })
//   } else {
//     this.fileInput.nativeElement.click();
//   }
// }

processWebImage(event) {
  let reader = new FileReader();
  reader.onload = (readerEvent) => {

    let imageData = (readerEvent.target as any).result;
    this.form.patchValue({ 'profilePic': imageData });
  };

  reader.readAsDataURL(event.target.files[0]);
}

getProfileImageStyle() {
  return 'url(' + this.form.controls['profilePic'].value + ')'
}

/**
 * The user cancelled, so we dismiss without sending data back.
 */
cancel() {
  this.viewCtrl.dismiss();
}


}
