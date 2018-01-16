import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Md5} from 'ts-md5/dist/md5';
import { Settings } from './settings';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public http: Http, public api: Api, public settings: Settings,) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  md5sum(text) {
      console.log('md5sum is ' + Md5.hashStr(text))
  }

  login(accountInfo: any) {
    let passmd5 = Md5.hashStr(accountInfo.password);
    let httprequest = 'http://api.adu.org.za/validation/user/login?'
    httprequest += 'API_KEY=499b262880d5f806c51bbaa61ae0118b';
    httprequest += '&userid=' + accountInfo.userid;
    httprequest += '&email=' + accountInfo.email;
    httprequest += '&passid=' + passmd5;
    let token: string;
    console.log(httprequest);
    let result: string;


    this.http.get(httprequest)
      .map(res => res.json()).subscribe(data => {
        // this.vmProjects = data.projects;
        console.log('Login result = ' + JSON.stringify(data) );
        if (data.registered.status.result == 'success') {
          console.log('Login success, token is ' + data.registered.status.token)
          // token = data.registered.status.token;
          let update = {
            userToken: data.registered.status.token,
            passmd5: passmd5,
            email: accountInfo.email,
            userid: accountInfo.userid,
            name: data.registered.data.Name,
            surname: data.registered.data.Surname,
            username: data.registered.data.Name + " " + data.registered.data.Surname
          }
          this.settings.merge(update);

        } else if (data.registered.status.result == 'failed') {
          // login failed, remove at least the token
          let update = {
            userToken: "",
            email: accountInfo.email,
            userid: accountInfo.userid
          }
        }
        result = data.registered.status.result;
    },
    err => {
        console.log('error fetching data: ' + JSON.stringify(err));
    },
    // this next bit happens on comlete
    () => {

      // console.log('Previous projectsUpdated: ' + this.settings.allSettings.projectsUpdated);


    });
    return result;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
