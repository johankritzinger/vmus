import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { ListProjectsPage } from '../list-projects/list-projects';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-content',
  templateUrl: 'help.html'
})
export class HelpPage {


  constructor(public navCtrl: NavController) { }

  goTutorialPage() {
    this.navCtrl.push(TutorialPage);
  }

  goListProjectsPage() {
    this.navCtrl.push(ListProjectsPage);
  }

  goAboutPage() {
    this.navCtrl.push(AboutPage);
  }

}
