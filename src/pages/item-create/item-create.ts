import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Vmrecords, VmprojectsProvider } from '../../providers/providers';
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
  recordReady: boolean = false;

  constructor(public vmprojects: VmprojectsProvider, public vmrecords: Vmrecords, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder) {

    // this.vmprojects.getRows();

    // console.log('Nav params data: ' + JSON.stringify(navParams.data));
    // console.log('vmprojects: ' + JSON.stringify(this.vmprojects.vmProjects));

    // this.form = formBuilder.group(navParams.data.vmrecord || vmrecords.newRecord());
    if (this.navParams.data.vmrecord) {
      this.form = this.formBuilder.group(this.navParams.data.vmrecord);
      this.recordReady = true;
    } else {
      this.form = this.formBuilder.group(this.vmrecords.newRecord()
      //  ; .then(() => {
      //   this.recordReady = true;
      // })
      )
    }

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FormpagePage ' + 'this.proj.Project_acronym');
  }

  ionViewWillEnter() {
    //
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

/**
 * The user is done and wants to create the item, so return it
 * back to the presenter.
 */
done() {
  if (!this.form.valid) { return; }
  // if (this.form.value.id && this.form.value.id != this.vmrecords.nextid) {
  //   console.log('updating record ' + this.form.value.id);
  //   this.vmrecords.update(this.form.value).then(s => {
  //     this.viewCtrl.dismiss(this.form.value);
  //   });
  // } else {
  //   console.log('adding record ' + this.form.value.id);
    this.vmrecords.addItem(this.form.value).then(s => {
      this.viewCtrl.dismiss(this.form.value);
    });
  // }
}

deleteItem(vmrecord) {
  this.vmrecords.del(this.form.value);
  this.viewCtrl.dismiss();
}

}
