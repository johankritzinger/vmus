import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordLocationPage } from './record-location';

@NgModule({
  declarations: [
    RecordLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(RecordLocationPage),
  ],
})
export class RecordLocationPageModule {}
