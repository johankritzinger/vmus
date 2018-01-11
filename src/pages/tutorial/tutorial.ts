import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { MainPage } from '../../pages/pages';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../providers/settings';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  nextpage: any = WelcomePage;

  // account: { email: string, password: string, userid: number } = {
  //   email: this.settings.allSettings.email || '',
  //   password: this.settings.allSettings.password || '',
  //   userid: this.settings.allSettings.userid ||''
  // };

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public settings: Settings,
    // translate: TranslateService
    ) {
    // translate.get(["TUTORIAL_SLIDE1_TITLE",
    //   "TUTORIAL_SLIDE1_DESCRIPTION",
    //   "TUTORIAL_SLIDE2_TITLE",
    //   "TUTORIAL_SLIDE2_DESCRIPTION",
    //   "TUTORIAL_SLIDE3_TITLE",
    //   "TUTORIAL_SLIDE3_DESCRIPTION",
    // ]).subscribe(
    //   (values) => {
    //     // console.log('Loaded values', values);
        this.slides = [
          {
            title: 'Welcome to the VMUS app',
            description: 'Currently this is proof of concept, saving records locally',
            image: 'assets/img/ica-slidebox-img-1.png',
          },
          {
            title: 'How to use the app',
            description: `Add a record, completing as much of the form as is convenient
              at the time. Leave a note for yourself, and capture the location. Photos can be
              added, or added later, e.g. by selecting from your camera roll or downloading them.`,
            image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: 'VMUS projects',
            description: `All records are submitted to specific projects.  Ensure you submit to the
            correct project.  See the records page for info on projects.  Projects should be updated
            about weekly if you're online`,
            image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: 'Photos',
            description: `Photos submitted are under the .... licence. If you take photos using
            the app, a copy is saved in your gallery / role - these are not deleted when you delete
            the photo / record.  Currently photos are not deleted other than when you specifically
            delete the photo, so space will become an issue.`,
            image: 'assets/img/ica-slidebox-img-3.png',
          }
        ];
      // });

  }

  startApp() {
    if (this.settings.allSettings.userid) {
      this.nextpage = MainPage;
    }
    this.navCtrl.setRoot(this.nextpage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
