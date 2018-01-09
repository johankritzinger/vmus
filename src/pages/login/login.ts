import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../providers/settings';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string, userid: number } = {
    email: this.settings.allSettings.email || '',
    password: this.settings.allSettings.password || '',
    userid: this.settings.allSettings.userid ||''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public settings: Settings
  ) {

    this.user.md5sum('passw0rd')

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

  }

  // http://api.adu.org.za/validation/user/login?API_KEY=499b262880d5f806c51bbaa61ae0118b&userid=18131&&email=johan.kritzinger@gmail.com&passid=71d00b760d017b2999eb54e32f41f592
  // http://vmus.adu.org.za/vm_projects.php?database=&prj_acronym=&db=&URL=&Logo=&Headline=&Use_main_filter=0&User_id=f5dcb5d0c3a7436e5925282bb547a170&Full_name=Johan%20Kritzinger&serve_sp_list=0&drop_down_list=0&assessment=0&query_id=0&Vm_number=0&recNo=0&numRows=0&start=0&message=Welcome_Johan_Kritzinger

  // Attempt to login in through our User service
  doLogin() {
    let value = this.user.login(this.account);
    // .then((value) => {
        this.navCtrl.push(MainPage);
      // } else {
      //
      // }
    // });
    // .subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //   this.navCtrl.push(MainPage);
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }
}
