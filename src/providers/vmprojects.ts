import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

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

    constructor( public http: Http) {
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
           console.log('OpenDb Error', e);
         }, () => {
           console.log('Populated Datebase OK..');
         })
     }

    fetchProjects () {
      this.http.get('http://vmus.adu.org.za/api/v1/projects').map(res => res.json()).subscribe(data => {
          this.vmProjects = data.projects;
          console.log('data.projects = ' + data.projects );
          if (this.vmProjects.length > 0) {
            for (var i = 0; i < this.vmProjects.length; i++) {
              this.saveProjects(this.vmProjects[i]);
            }
          }


          // return data.projects;
      },
      err => {
          console.log(err);
      });
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
            console.log('Inserted... Sucess..', i);
            this.getRows();
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
