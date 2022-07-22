import sqlite3 from "sqlite3";
export class Database {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            var _a;
            if (err) {
                console.log('Could not connect to database', err);
            }
            else {
                console.log('Connected to database: ' + ((_a = dbFilePath.split("./").pop()) === null || _a === void 0 ? void 0 : _a.split(".db")[0]));
            }
        });
    }
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    exec(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
}
