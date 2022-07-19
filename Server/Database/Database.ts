import sqlite3 from "sqlite3";

export class Database {
  db;
  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err: any) => {

      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database: ' + dbFilePath.split("./").pop()?.split(".db")[0]);
      }
    })
  }
  run(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err: any) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve({ id: this.lastID })
        }
      })
    })
  }
  get(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: any, result: any) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  all(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: any, rows: any) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
  exec(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: any, rows: any) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}
