import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicsPage } from './pics';

@NgModule({
  declarations: [
    PicsPage,
  ],
  imports: [
    IonicPageModule.forChild(PicsPage),
  ],
})
export class PicsPageModule {}
