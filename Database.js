"use strict";
exports.__esModule = true;
exports.Database = void 0;
var sqlite3 = require('sqlite3');
var Database = /** @class */ (function () {
    function Database(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, function (err) {
            if (err) {
                console.log('Could not connect to database', err);
            }
            else {
                console.log('Connected to database: ' + dbFilePath.split("./").pop().split(".db")[0]);
            }
        });
    }
    Database.prototype.run = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, params, function (err) {
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
    };
    Database.prototype.get = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            _this.db.get(sql, params, function (err, result) {
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
    };
    Database.prototype.all = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, params, function (err, rows) {
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
    };
    return Database;
}());
exports.Database = Database;
