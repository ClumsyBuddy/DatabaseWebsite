"use strict";
exports.__esModule = true;
exports.DatabaseManager = void 0;
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(db) {
        this.DatabaseConnection = db; //Connection to the Database class itself
        this.Table = undefined; //Store the table for this instance of DBManager
        this.Columns = ''; //Stores the Column Data so we can dynamically create new DBManagers
        this.QuestionMarkArray = ''; //Not a actual Array
    }
    DatabaseManager.prototype.createTable = function (_Table, Columns) {
        this.Table = _Table; //Table name
        this.Columns = Columns; //Column Data
        var _length = this.Columns.split(",").length - 1; //Get the number of columns by getting how many comma separations their are
        for (var i = 0; i < _length; i++) { //Build a string with the Question marks
            this.QuestionMarkArray += ", ?"; //Add the Question marks
        }
        var sql = "CREATE TABLE IF NOT EXISTS ".concat(this.Table, " (key INTEGER PRIMARY KEY AUTOINCREMENT, ").concat(this.Columns, ")"); //Create a Table with passed values
        return this.DatabaseConnection.run(sql); //Pass sql to Database
    };
    DatabaseManager.prototype.create = function (params) {
        if (params === void 0) { params = []; }
        return this.DatabaseConnection.run("INSERT INTO ".concat(this.Table, " (").concat(this.Columns, ") VALUES(null").concat(this.QuestionMarkArray, ")"), params);
    };
    DatabaseManager.prototype.update = function (itemName, newValue, key) {
        return this.DatabaseConnection.run("UPDATE ".concat(this.Table, " SET ").concat(itemName, " = ? WHERE key = ?"), [newValue, key]);
    };
    DatabaseManager.prototype["delete"] = function (key) {
        return this.DatabaseConnection.run("DELETE FROM ".concat(this.Table, " WHERE key = ?"), [key]);
    };
    DatabaseManager.prototype.getByColumn = function (ColumnName, ColumnValue) {
        return this.DatabaseConnection.get("SELECT * FROM ".concat(this.Table, " WHERE ").concat(ColumnName, " = ?"), [ColumnValue]);
    };
    DatabaseManager.prototype.getAll = function () {
        return this.DatabaseConnection.all("SELECT * FROM ".concat(this.Table));
    };
    DatabaseManager.prototype.customQuery = function (query) {
        return this.DatabaseConnection.run(query);
    };
    return DatabaseManager;
}());
exports.DatabaseManager = DatabaseManager;
