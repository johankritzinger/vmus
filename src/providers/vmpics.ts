import { Injectable } from '@angular/core';
import { Settings } from './settings';
import 'rxjs/add/operator/do';

/*
  Generated class for the VmprojectsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var window : any;

@Injectable()
export class VmpicsProvider {


    public vmPics = [];
    public db = null;

    constructor(
        public settings: Settings
      ) {

        this.settings.load().then(() => {
          let today = new Date();
        });
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
           tx.executeSql(`CREATE TABLE IF NOT EXISTS VMPics (
          Id INT PRIMARY KEY,
          RecordId VARCHAR(50),
          PicNum INT,
          Content TEXT,
          Updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], (r) => {
            console.log('VMPics Table created ... Sucess..');
          }, e => {
            console.log('Error creating VMPics table', e);
          });

         }, (e) => {
           console.log('VMPics OpenDb Error', e);
         }, () => {
           console.log('VMPics Datebase OK..');
         })
        this
          .db
          .executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_recordId ON VMPics(RecordId,PicNum);")
     }

    savePic(i) {
      return new Promise(resolve => {
        var InsertQuery = `INSERT OR REPLACE INTO VMPics (
             RecordId,
             PicNum,
             Content,
             )
             VALUES (?, ?, ?)`;
        this
          .db
          .executeSql(InsertQuery, [i.RecordId,
                                     i.PicNum,
                                     i.Content], (r) => {
            // console.log('Inserted... Sucess..', i);
          }, e => {
            console.log('Inserted Error', e);
            resolve(false);
          })
      })
    }

    getPics(recordId) {
      return new Promise(res => {
        this.vmPics = [];
        let query = "SELECT * FROM VMPics WHERE RecordId = ? ORDER BY PicNum";
        this
          .db
          .executeSql(query, [ recordId ], rs => {
              for (var i = 0; i < rs.rows.length; i++) {
                var item = rs
                  .rows
                  .item(i);
                this
                  .vmPics
                  .push(item);
                // console.log('fetched vmproject ' + i + ' of ' + rs.rows.length)
              }
              // console.log('vmprojects now: ' + JSON.stringify(this.vmProjects))
            res(true);
          }, (e) => {
            console.log('Sql Query Error', e);
          });
      })
    }

    delPic(Id) {
      return new Promise(resolve => {
        console.log('deleting record ' + Id)
        var query = "DELETE FROM VMPics WHERE Id=?";
        this
          .db
          .executeSql(query, [Id], (s) => {
            console.log('Delete Success...', s);
          }, (err) => {
            console.log('Deleting Error', err);
          });
      })
    }

    delRecordPics(recordId) {
      return new Promise(resolve => {
        console.log('deleting record ' + recordId)
        var query = "DELETE FROM VMPics WHERE RecordId=?";
        this
          .db
          .executeSql(query, [recordId], (s) => {
            console.log('Delete Success...', s);
          }, (err) => {
            console.log('Deleting Error', err);
          });
      })
    }

    removeOrphans() {
      var query = `DELETE FROM VMPics WHERE RecordId IN
          (SELECT VMPics.RecordId FROM VMPics LEFT JOIN VMRecords ON VMPics.RecordId=VMRecords.id WHERE VMRecords.id IS NULL);`
      return new Promise(resolve => {
        this
          .db
          .executeSql(query, [], (s) => {
            console.log('Delete Success...', s);
          }, (err) => {
            console.log('Deleting Error', err);
          });
      })
    }

}
