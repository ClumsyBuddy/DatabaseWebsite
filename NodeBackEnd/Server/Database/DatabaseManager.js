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
    createTable(_Table, Columns) {
        const sql = `CREATE TABLE IF NOT EXISTS ${_Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${Columns})`; //Create a Table with passed values
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
    update(name, column, newValue, key) {
        return this.DatabaseConnection.run(`UPDATE ${name} SET ${column} = ? WHERE key = ${key}`, newValue);
    }
    delete(name, key) {
        return this.DatabaseConnection.run(`DELETE FROM ${name} WHERE key = ?`, [key]);
    }
    getById(name, id) {
        return this.DatabaseConnection.get(`SELECT * FROM ${name} WHERE key = ${id}`);
    }
    getByColumn(name, ColumnName, ColumnValue) {
        return this.DatabaseConnection.get(`SELECT * FROM ${name} WHERE ${ColumnName} = ?`, [ColumnValue]);
    }
    getAll(name) {
        return this.DatabaseConnection.all(`SELECT * FROM ${name}`);
    }
    customQuery(query) {
        return this.DatabaseConnection.run(query);
    }
}
export { DatabaseManager };
