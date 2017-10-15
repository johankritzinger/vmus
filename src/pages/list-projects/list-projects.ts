import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { VmprojectsProvider } from '../../providers/providers';
import { ProjectDetailsPage } from '../project-details/project-details'


/**
 * Generated class for the ListProjectsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-list-projects',
  templateUrl: 'list-projects.html',
})
export class ListProjectsPage {

  constructor(public navCtrl: NavController, public vmprojects: VmprojectsProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListProjectsPage');
  }

  openItem(project) {
    this.navCtrl.push(ProjectDetailsPage, {
      project
    });
  }

  updateProjects() {
    this.vmprojects.fetchProjects();
  }

}
