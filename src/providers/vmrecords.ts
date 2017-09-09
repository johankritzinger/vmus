import {Injectable} from '@angular/core';
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
  constructor() {}
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
      }, (e) => {
        console.log('OpenDb Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      })
  }

  newRecord: any = {
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
      "roadkill": '',
  };

  /**
   *
   * @param addItem for adding: function
   */
  addItem(i) {
    return new Promise(resolve => {
      var InsertQuery = `INSERT INTO VMRecords (email,
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
        roadkill) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      this
        .db
        .executeSql(InsertQuery, [i.email,
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
              resolve(true)
            });
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
  del(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM VMRecords WHERE id=?";
      this
        .db
        .executeSql(query, [id], (s) => {
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
  //to Update any Item
  update(id, i) {
    return new Promise(res => {
      var query = `UPDATE Todo SET (email,
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
        roadkill) VALUES (
            i.email,
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
            i.roadkill
          ) WHERE id=?`;
      this
        .db
        .executeSql(query, [
          i, id
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getRows()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

}
