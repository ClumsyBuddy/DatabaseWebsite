/*
*
* This class is the wrapper around the Database class. This allows easy of use with simple functions to call on the most used functionality of SQL
* DbStorage is the star of the show. Dbstorage takes in a key to represent which table it aligns with.
* This allows you to store a Table, Keys and Data, with the amount of question marks for the SQL queries
* This hopefully keeps the DatabaseManager as dynamic and modular as possible so that it can be used across any Database needs
*
*/
class DatabaseManager {
    constructor(db) {
        this.DatabaseConnection = db; //Connection to the Database class itself    
    }
    // name is the name of the DbStorage Object we would like to use.
    createTable(name, _Table, Columns) {
        var _length = Columns.split(",").length; //Get the number of columns by getting how many comma separations their are
        var QuestionMarkArray = '';
        for (var i = 0; i < _length; i++) { //Build a string with the Question marks
            QuestionMarkArray += ", ?"; //Add the Question marks
        }
        this.DbStorage = Object.assign(Object.assign({}, this.DbStorage), {
            [name]: {
                Table: _Table,
                Columns: Columns,
                QuestionMarkArray: QuestionMarkArray
            }
        });
        const sql = `CREATE TABLE IF NOT EXISTS ${this.DbStorage[name].Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${this.DbStorage[name].Columns})`; //Create a Table with passed values
        return this.DatabaseConnection.run(sql); //Pass sql to Database
    }
    getColumns(name) {
        var sql = `PRAGMA table_info('${name}')`;
        return this.DatabaseConnection.exec(sql);
    }
    updateTable(name, ColumnName) {
        // Alter TABLE tablename
        //      ADD new_column_name column_definitions
        var sql = `ALTER TABLE ${name} ADD ${ColumnName}`;
        return this.DatabaseConnection.run(sql);
    }
    create(name, columns, QuestionMark, params = []) {
        return this.DatabaseConnection.run(`INSERT INTO ${name} (${columns}) VALUES(${QuestionMark})`, params);
    }
    update(name, itemName, newValue, key) {
        return this.DatabaseConnection.run(`UPDATE ${this.DbStorage[name].Table} SET ${itemName} = ? WHERE key = ?`, [newValue, key]);
    }
    delete(name, key) {
        return this.DatabaseConnection.run(`DELETE FROM ${name} WHERE key = ?`, [key]);
    }
    getById(name, id) {
        return this.DatabaseConnection.get(`SELECT * FROM ${name} WHERE key = ${id}`);
    }
    getByColumn(name, ColumnName, ColumnValue) {
        return this.DatabaseConnection.get(`SELECT * FROM ${this.DbStorage[name].Table} WHERE ${ColumnName} = ?`, [ColumnValue]);
    }
    getAll(name) {
        return this.DatabaseConnection.all(`SELECT * FROM ${name}`);
    }
    customQuery(query) {
        return this.DatabaseConnection.run(query);
    }
}
export { DatabaseManager };
