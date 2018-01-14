import {Injectable} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Settings } from './settings';
// import { Vmrecord } from '../models/vmrecord';
import { Location } from './location';
import { VmpicsProvider } from './vmpics';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

declare var window : any;
@Injectable()
export class Vmrecords {
  public text : string = "";
  public db = null;
  public arr = [];
  public nextid: number = 1;
  public record: any;
  form: FormGroup;
  isNewRecord: boolean = false;
  // isTrackingLocation: boolean = false;
  // isTrackingAltitude: boolean = false;

  // settingsReady = false;

  statusText = {
      0: 'new',
      1: 'ready',
      2: 'tosubmit',
      3: 'submitted'
    };

  constructor(public geolocation: Geolocation,
    public settings: Settings,
    public location: Location,
    public formBuilder: FormBuilder,
    public http: Http,
    public vmpics: VmpicsProvider,
    ) {
    // this.settings.load();
  }
 /**
  *
  * Open The Datebase
  */
  openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'data.db', location: 'default'});
    this
      .db
      .transaction((tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS VMRecords (id integer primary key,
          email text,
          observers text,
          project text,
          country text,
          province text,
          nearesttown text,
          locality text,
          minelev int,
          maxelev int,
          lat text,
          long text,
          datum text,
          accuracy int,
          source text,
          date text,
          year int,
          month int,
          day int,
          note text,
          userdet text,
          nestcount int,
          nestsite text,
          roadkill bool,
          mailto text,
          mailsubject text,
          pic1 text,
          pic2 text,
          pic3 text,
          imageurl text,
          sound1 text,
          status int
          )`);
          this.getNextid();
      }, (e) => {
        console.log('OpenDb Error', JSON.stringify(e));
      }, () => {
        console.log('Created VMRecords Datebase OK..');
      })
  }

  emptyRecord: any = {
    "id": null,
    "email": '',
      "observers": '',
      "project": '',
      "country": '',
      "province": '',
      "nearesttown": '',
      "locality": '',
      "minelev": '',
      "maxelev": '',
      "lat": '',
      "long": '',
      "datum": '',
      "accuracy": '',
      "source": 'GPS',
      "date": '1990-01-01',
      "year": '',
      "month": '',
      "day": '',
      "note": '',
      "userdet": '',
      "nestcount": '',
      "nestsite": '',
      "roadkill": false,
      "pic1": '',
      "pic2": '',
      "pic3": '',
      "sound1": '',
      "isTrackingLocation":false,
      "isTrackingAltitude": false
      };

  checkReadyToSubmit() {
      // Check if record meets all criteria to submit
      var a = 0;
      var b = 0;

      a += (this.record.project)? 1 : 0; b += 1;
      a += (this.settings.allSettings.email)? 1 : 0; b += 1;
      a += (this.settings.allSettings.username)? 1 : 0; b += 1;
      a += (this.settings.allSettings.userid)? 1 : 0; b += 1;
      a += (this.settings.allSettings.userToken)? 1 : 0; b += 1;
      a += (this.record.country != "")? 1 : 0; b += 1;
      a += (this.record.province)? 1 : 0; b += 1;
      a += (this.record.nearesttown)? 1 : 0; b += 1;
      a += (this.record.locality)? 1 : 0; b += 1;
      a += (this.record.minelev || this.record.maxelev)? 1 : 0; b += 1;
      a += (this.record.lat)? 1 : 0; b += 1;
      a += (this.record.long)? 1 : 0; b += 1;
      a += (this.record.source)? 1 : 0; b += 1;
      a += (this.record.year)? 1 : 0; b += 1;
      a += (this.record.month)? 1 : 0; b += 1;
      a += (this.record.day)? 1 : 0; b += 1;
      // etc etc

      if(a == b) {
          //do stuff
          if (!this.record.status) {
            this.record.status = 1;
          }
      } else if (this.record.status < 3) {
        this.record.status = 0;
      }
      console.log(this.record.country + ' a ' + a + ' b ' + b + ' and Record status: ' + this.record.status)
      if (this.record.status == 3) {
        return false
      } else {
        return this.record.status;
      }
  }

  getNextid()    {
      this
        .db
        .executeSql('SELECT max(id) AS next FROM VMRecords', [], rs => {
          if (rs.rows.length > 0) {
            this.nextid = rs
              .rows
              .item(0).next + 1;
            console.log('Next id = ' + JSON.stringify(this.nextid) );
          }
        }, (e) => {
          console.log('Sql Query Error', e);
        });
  }

  newRecord() {
    this.isNewRecord = true;
    // this.isTrackingLocation = true;
    // this.isTrackingAltitude = true;
    // return new Promise(resolve => {
      this.record = this.emptyRecord;
      this.record.isTrackingLocation = true;
      this.record.isTrackingAltitude = true;

      var today = new Date();
      // this.record.date = today;
      this.record.year = today.getFullYear();
      this.record.month = today.getMonth()+1;
      this.record.day = today.getDate();
      console.log('date set to: ' + today);
      this.record.date = today.toISOString();
      console.log('date set to: ' + this.record.date);

      // this.settings.load().then(() => {
        // this.settingsReady = true;
        this.record.email = this.settings.allSettings.email;
        this.record.project = this.settings.allSettings.prefProject;
      // });

      this
        .db
        .executeSql('SELECT max(id) AS next FROM VMRecords', [], rs => {
          if (rs.rows.length > 0) {
            this.nextid = rs
              .rows
              .item(0).next + 1;
            console.log('Next id = ' + JSON.stringify(this.nextid) );
            this.record.id = this.nextid;
          }
        }, (e) => {
          console.log('Sql Query Error', e);
        });

      this.location.startTracking();

      this.record.lat = this.location.lat;
      this.record.long = this.location.lng;
      this.record.accuracy = this.location.accuracy;
      this.record.minelev = this.location.altitude - this.location.altitudeAccuracy;
      this.record.maxelev = this.location.altitude + this.location.altitudeAccuracy;


      // this.geolocation.getCurrentPosition().then((position) => {
      //   record.lat = position.coords.latitude;
      //   record.long = position.coords.longitude;
      //   record.accuracy =  position.coords.accuracy;
      //   record.minelev = position.coords.altitude - position.coords.altitudeAccuracy;
      //   record.maxelev = position.coords.altitude + position.coords.altitudeAccuracy;
      //   }, (err) => {
      //     console.log('map error: ' + err.message);
      //   });
      // return record;
    // })
    return this.record;
  }

  /**
   *
   * @param addItem for adding: function
   */
  addItem(i) {
    this.isNewRecord = false;
    // this.isTrackingLocation = false;
    // this.isTrackingAltitude = false;
    let status = this.checkReadyToSubmit();
    return new Promise(resolve => {
      var InsertQuery = `INSERT OR REPLACE INTO VMRecords (id, email,
        observers,
        project,
        country,
        province,
        nearesttown,
        locality,
        minelev,
        maxelev,
        lat,
        long,
        datum,
        accuracy,
        source,
        date,
        year,
        month,
        day,
        note,
        userdet,
        nestcount,
        nestsite,
        roadkill,
        pic1,
        pic2,
        pic3,
        sound1,
        status ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      this
        .db
        .executeSql(InsertQuery, [i.id, i.email,
        i.observers,
        i.project,
        i.country,
        i.province,
        i.nearesttown,
        i.locality,
        i.minelev,
        i.maxelev,
        i.lat,
        i.long,
        i.datum,
        i.accuracy,
        i.source,
        i.date,
        i.year,
        i.month,
        i.day,
        i.note,
        i.userdet,
        i.nestcount,
        i.nestsite,
        i.roadkill,
        i.pic1,
        i.pic2,
        i.pic3,
        i.sound1,
        status
       ], (r) => {
          // console.log('Inserted... Sucess..', i);
          this
            .getRows()
            .then(s => {
              resolve(true);
              // console.log('getRows: ' + JSON.stringify(this.arr))
            });
            this.getNextid();
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

  //Refresh everytime

  getRows() {
    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM VMRecords WHERE status IS NULL or status < 3";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arr
                .push(item);
              console.log('fetched item ' + JSON.stringify(item))
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }
  //to delete any Item
  del(i) {
    // this.arr.splice(this.arr.indexOf(i)-1, 1);
    this.isNewRecord = false;
    return new Promise(resolve => {
      console.log('deleting record ' + i.id)
      var query = "DELETE FROM VMRecords WHERE id=?";
      this
        .db
        .executeSql(query, [i.id], (s) => {
          console.log('Delete Success...', s);
          this
            .getRows()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

  //  stolen from https://github.com/angular/angular/issues/13241
  getFormUrlEncoded(toConvert) {
  		const formBody = [];
  		for (const property in toConvert) {
  			const encodedKey = encodeURIComponent(property);
  			const encodedValue = encodeURIComponent(toConvert[property]);
  			formBody.push(encodedKey + '=' + encodedValue);
  		}
  		return formBody.join('&');
  	}

  // stolen from https://stackoverflow.com/questions/25141949/ionic-angular-js-taking-pictures-sending-to-server-null-images/25995009#25995009
  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
     var byteString = atob(dataURI.split(',')[1]);
     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

     var ab = new ArrayBuffer(byteString.length);
     var ia = new Uint8Array(ab);
     for (var i = 0; i < byteString.length; i++)
     {
        ia[i] = byteString.charCodeAt(i);
     }

     var bb = new Blob([ab], { "type": mimeString });
     return bb;
  }

  submitRecordToADU() {
    // Do not add options, it breaks
      let images = [];
      this.vmpics.getPics(this.record.id).then(s =>{
        // console.log(this.vmpics.vmPics.pic1);

        let roadkill = (this.record.roadkill == true)? '1' : '0';
        let fd = new FormData();
          fd.append('token', this.settings.allSettings.userToken);
          fd.append('API_KEY', '499b262880d5f806c51bbaa61ae0118b');
          fd.append('username', this.settings.allSettings.username);
          fd.append('project', this.record.project);
          fd.append('email', this.settings.allSettings.email);
          fd.append('userid', this.settings.allSettings.userid);
          fd.append('token', this.settings.allSettings.userToken);
          fd.append('country', this.record.country);
          fd.append('province', this.record.province);
          fd.append('nearesttown', this.record.nearesttown);
          fd.append('locality', this.record.locality);
          fd.append('minelev', this.record.minelev);
          fd.append('maxelev', this.record.maxelev);
          fd.append('lat', this.record.lat);
          fd.append('long', this.record.long);
          fd.append('source', this.record.source);
          fd.append('year', this.record.year);
          fd.append('month', this.record.month);
          fd.append('day', this.record.day);
          fd.append('observers', this.record.observers);
          fd.append('accuracy', this.record.accuracy);
          fd.append('note', this.record.note);
          fd.append('userdet', this.record.userdet);
          fd.append('roadkill', roadkill);

          // console.log('fd set pre images: ' + fd.get('API_KEY'));

          for (var i = 1; i < 4; i++ ) {
            if (this.vmpics.vmPics['pic' + i]) {
              var filename = "image_" + i + ".jpg";
              let photoblob = this.dataURItoBlob('data:image/jpg;base64,' + this.vmpics.vmPics['pic' + i]);
              images += this.vmpics.vmPics['pic' + i], filename;
              fd.append('images[]', photoblob, filename );
            }
          }
          // console.log('fd set images: ' + JSON.stringify(fd.getAll('images[]')) );

        //  // Option 2 - better Http post
        return new Promise((resolve, reject) => {
          this.http.post('http://vmus.adu.org.za/api/v1/insertrecord', fd)
          .toPromise()
          .then((response) =>
          {
            console.log('API Response : ', JSON.stringify(response));

            // Mark record as submitted
            this.record.status = 3;
            console.log(JSON.stringify(this.record))
            this.addItem(this.record);

            resolve(response.json());
          })
          .catch((error) =>
          {
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            // reject(error.json());
          });
        });

      });
  }
}
