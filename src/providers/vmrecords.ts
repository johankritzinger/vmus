import {Injectable} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Settings } from './settings';
// import { Vmrecord } from '../models/vmrecord';
import { Location } from './location';

/*
  Generated class for the Sqlite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var window : any;
@Injectable()
export class Vmrecords {
  public text : string = "";
  public db = null;
  public arr = [];
  public nextid: number = 1;
  public record: any;

  // settingsReady = false;

  constructor(public geolocation: Geolocation,
    public settings: Settings,
    public location: Location
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
          year int,
          month int,
          day int,
          note text,
          userdet text,
          nestcount int,
          nestsite text,
          roadkill bool
          )`);
          this.getNextid();
      }, (e) => {
        console.log('OpenDb Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
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
      "source": '',
      "year": '',
      "month": '',
      "day": '',
      "note": '',
      "userdet": '',
      "nestcount": '',
      "nestsite": '',
      "roadkill": false,
  };

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
    // return new Promise(resolve => {
      this.record = this.emptyRecord;

      var today = new Date();
      this.record.year = today.getFullYear();
      this.record.month = today.getMonth()+1;
      this.record.day = today.getDate();

      this.settings.load().then(() => {
        // this.settingsReady = true;
        this.record.email = this.settings.allSettings.email;
        this.record.project = this.settings.allSettings.prefProject;
      });

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
  }

  /**
   *
   * @param addItem for adding: function
   */
  addItem(i) {
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
        year,
        month,
        day,
        note,
        userdet,
        nestcount,
        nestsite,
        roadkill) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
        i.year,
        i.month,
        i.day,
        i.note,
        i.userdet,
        i.nestcount,
        i.nestsite,
        i.roadkill ], (r) => {
          console.log('Inserted... Sucess..', i);
          this
            .getRows()
            .then(s => {
              resolve(true);
              console.log('getRows: ' + JSON.stringify(this.arr))
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
      let query = "SELECT * FROM VMRecords";
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
              console.log('fetched item ' + i)
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
    return new Promise(resolve => {
      console.log('deleting record ' + i)
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
  //to Update any Item (addItem now deals with this)
  // update(i) {
  //   console.log('updating record ' + i.id)
  //   return new Promise(res => {
  //     var query = `UPDATE VMRecords SET
  //       email='` + i.email + `',
  //       observers='` + i.observers + `',
  //       project='` + i.project + `',
  //       userdet='` + i.userdet + `',
  //       country='` + i.country + `',
  //       province='` + i.province + `',
  //       nearesttown='` + i.nearesttown + `',
  //       locality='` + i.locality + `',
  //       minelev='` + i.minelev + `',
  //       maxelev='` + i.maxelev + `',
  //       lat='` + i.lat + `',
  //       long='` + i.long + `',
  //       datum='` + i.datum + `',
  //       accuracy='` + i.accuracy + `',
  //       source='` + i.source + `',
  //       year='` + i.year + `',
  //       month='` + i.month + `',
  //       day='` + i.day + `',
  //       note='` + i.note + `',
  //       nestcount='` + i.nestcount + `',
  //       nestsite='` + i.nestsite + `',
  //       roadkill='` + i.roadkill + `'
  //         WHERE id=` + i.id;
  //     this
  //       .db
  //       .executeSql(query, [], (s) => {
  //         console.log('Update Success...', s);
  //         this
  //           .getRows()
  //           .then(s => {
  //             res(true);
  //           });
  //       }, (err) => {
  //         console.log('Updating Error', err);
  //       });
  //   })
  //
  // }

}
