/*
*
* This class is the wrapper around the Database class. This allows easy of use with simple functions to call on the most used functionality of SQL
* DbStorage is the star of the show. Dbstorage takes in a key to represent which table it aligns with.
* This allows you to store a Table, Keys and Data, with the amount of question marks for the SQL queries
* This hopefully keeps the DatabaseManager as dynamic and modular as possible so that it can be used across any Database needs
*
*/

class DatabaseManager {
  DatabaseConnection: any;
  KeyCounter:number;
    constructor(db) {
      this.DatabaseConnection = db //Connection to the Database class itself    
    }
    // name is the name of the DbStorage Object we would like to use.
    createTable(_Table:string, Columns:string) {
      const sql = `CREATE TABLE IF NOT EXISTS ${_Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${Columns})` //Create a Table with passed values
      return this.DatabaseConnection.run(sql)//Pass sql to Database
    }

    getColumns(name:string){
      var sql = `PRAGMA table_info('${name}')`;
      return this.DatabaseConnection.exec(sql); 
    }

    updateTable(name:string, ColumnName){
      // Alter TABLE tablename
      //      ADD new_column_name column_definitions
      var sql = `ALTER TABLE ${name} ADD ${ColumnName}`;
      return this.DatabaseConnection.run(sql);
    }

    create(name:string, columns:string, QuestionMark:string, params: string[] = []){ //Create a new item using the Classes Table, Column Data and Questionmark Array built from the Columns. We only need to pass in the params
        return this.DatabaseConnection.run( `INSERT INTO ${name} (${columns}) VALUES(${QuestionMark})`, params);
      }

    update(name:string, column:string, newValue: any,  key:number) { //update a element using the Name of the Column item and the key of the item.
      return this.DatabaseConnection.run(
        `UPDATE ${name} SET ${column} = ? WHERE key = ${key}`, newValue);
    }

    delete(name:string, key:number) { //Delete the item using the key
      return this.DatabaseConnection.run(
        `DELETE FROM ${name} WHERE key = ?`,
        [key]
      );
    }

    getById(name, id){
      return this.DatabaseConnection.get(`SELECT * FROM ${name} WHERE key = ${id}`);
    }

    getByColumn(name:string, ColumnName:string, ColumnValue:any) { //Find a specfic item using the name of the column and the value you are looking for
          return this.DatabaseConnection.get(`SELECT * FROM ${name} WHERE ${ColumnName} = ?`,
              [ColumnValue]);
    }

    getAll(name:string) { //Gets all items from DB
      return this.DatabaseConnection.all(`SELECT * FROM ${name}`)
    }

    customQuery(query:string){ //Custom Query just incase I want to use it
      return this.DatabaseConnection.run(query);
    }

  }
  
export {DatabaseManager};