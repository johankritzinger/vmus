import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Settings } from './settings';
import { Connection } from './connection';
import 'rxjs/add/operator/do';

/*
  Generated class for the VmprojectsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var window : any;

@Injectable()
export class VmprojectsProvider {


    public vmProjects = [];
    public db = null;

    constructor( public http: Http,
        public settings: Settings,
        public connection: Connection
      ) {

        this.settings.load().then(() => {
          let today = new Date();
          let lastUpd = new Date(this.settings.allSettings.projectsUpdated)
          if ((today.getTime() - lastUpd.getTime() > 1000*60*60*24*7) && this.connection.connected ) {
            this.fetchProjects ();
          }
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
           tx.executeSql(`CREATE TABLE IF NOT EXISTS VMProjects (
          Project_acronym VARCHAR(50) PRIMARY KEY,
          Database_name VARCHAR(50),
          Description TEXT,
          Date_started DATETIME,
          LastUsed DATETIME
        )`, [], (r) => {
            console.log('VMProjects Table created ... Sucess..');
            this.getRows();
          }, e => {
            console.log('Error creating VMProjects table', e);
          });

         }, (e) => {
           console.log('VMProjects OpenDb Error', e);
         }, () => {
           console.log('VMProjects Datebase OK..');
         })
     }

    fetchProjects () {
      if (this.connection.connected) {
        console.log('updating projects now')
        this.http.get('http://vmus.adu.org.za/api/v1/projects')
          .map(res => res.json()).subscribe(data => {
            // this.vmProjects = data.projects;
            console.log('data.projects.length = ' + data.projects.length );
            if (data.projects.length > 0) {
              for (var i = 0; i < data.projects.length; i++) {
                console.log('saving project ' + i);
                this.saveProjects(data.projects[i]);
              }
            }
            // return data.projects;
        },
        err => {
            console.log('error fetching data: ' + JSON.stringify(err));
        },
        // this next bit happens on comlete
        () => {
          this.getRows();
          console.log('Previous projectsUpdated: ' + this.settings.allSettings.projectsUpdated);
          let update = {
            projectsUpdated: new Date()
          }
          this.settings.merge(update);

        });
      }
    }

    saveProjects(i) {
      return new Promise(resolve => {
        var InsertQuery = `INSERT OR REPLACE INTO  VMProjects (
             Project_acronym,
             Database_name,
             Description,
             Date_started
             )
             VALUES (?, ?, ?, ?)`;
        this
          .db
          .executeSql(InsertQuery, [i.Project_acronym,
                                     i.Database_name,
                                     i.Description,
                                     i.Date_started], (r) => {
            // console.log('Inserted... Sucess..', i);

          }, e => {
            console.log('Inserted Error', e);
            resolve(false);
          })
      })
    }

    getRows() {
      return new Promise(res => {
        this.vmProjects = [];
        let query = "SELECT * FROM VMProjects";
        this
          .db
          .executeSql(query, [], rs => {
            if (rs.rows.length > 5) {
              for (var i = 0; i < rs.rows.length; i++) {
                var item = rs
                  .rows
                  .item(i);
                this
                  .vmProjects
                  .push(item);
                // console.log('fetched vmproject ' + i + ' of ' + rs.rows.length)
              }
              // console.log('vmprojects now: ' + JSON.stringify(this.vmProjects))
            } else {
              this.fetchProjects ();
            }
            res(true);
          }, (e) => {
            console.log('Sql Query Error', e);
          });
      })

    }

}
