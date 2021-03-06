import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { Settings,VmprojectsProvider } from '../../providers/providers';

import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  login() {
    this.navCtrl.push(LoginPage);
  }

  logout(){
    this.settings.allSettings.userToken = '';
  }

  picSettings = {
    page: 'pics',
    pageTitleKey: 'SETTINGS_PAGE_PICS'
  }

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;
  projectsUpdated: string = new Date(this.settings.allSettings.projectsUpdated).toLocaleDateString();

  subSettings: any = SettingsPage;

  loginButtonText: string = 'Log in';

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public vmprojects: VmprojectsProvider) {

  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      email: [this.options.email],
      prefProject: [this.options.prefProject],
      skipIntro: [this.options.skipIntro]
    };
    console.log(' Project updated: ' + JSON.stringify(this.options));

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          email: [this.options.email],
          userid: [this.options.userid],
          username: [this.options.username]
        };
        if (this.settings.allSettings.userToken) {
          this.loginButtonText = 'Change login';
        }
        break;
      case 'pics':
        group = {
          quality: [this.options.quality || 75],
          picsize: [this.options.picsize || 1000 ]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  updateProjects() {
    this.vmprojects.fetchProjects();
  }
}
