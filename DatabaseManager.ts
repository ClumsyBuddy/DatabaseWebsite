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
  DbStorage:object;
    constructor(db) {
      this.DatabaseConnection = db //Connection to the Database class itself    
    }
    // name is the name of the DbStorage Object we would like to use.
    createTable(name: string, _Table:string, Columns:string) {
      var _length = Columns.split(",").length; //Get the number of columns by getting how many comma separations their are
      var QuestionMarkArray = '';
      for(var i = 0; i < _length; i++){ //Build a string with the Question marks
        QuestionMarkArray += ", ?"; //Add the Question marks
      }
      this.DbStorage = {...this.DbStorage, ...{ //This is a weird way to achieve this dynamically DbStorage = {"Sable":{Table:_Table, Columns:Columns, QuestionMark:QuestionMark}}
          [name]:{
          Table:_Table,
          Columns:Columns,
          QuestionMarkArray:QuestionMarkArray
        }
      }};

      const sql = `CREATE TABLE IF NOT EXISTS ${this.DbStorage[name].Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${this.DbStorage[name].Columns})` //Create a Table with passed values
      return this.DatabaseConnection.run(sql)//Pass sql to Database
    }

    getColumns(name:string){
      var sql = `PRAGMA table_info(${name});`;
      return this.DatabaseConnection.all(sql); 
    }

    updateTable(name:string, ColumnName, Column_Definition){
      // Alter TABLE tablename
      //      ADD new_column_name column_definitions
      var sql = `ALTER TABLE ${this.DbStorage[name].Table} ADD ${ColumnName} ${Column_Definition}`;
      return this.DatabaseConnection.run(sql);
    }



    create(name:string, params = []){ //Create a new item using the Classes Table, Column Data and Questionmark Array built from the Columns. We only need to pass in the params
        return this.DatabaseConnection.run( `INSERT INTO ${this.DbStorage[name].Table} (${this.DbStorage[name].Columns}) VALUES(null${this.DbStorage[name].QuestionMarkArray})`, params);
      }


      update(name:string, itemName:string, newValue: any, key:number) { //update a element using the Name of the Column item and the key of the item.
        return this.DatabaseConnection.run(
          `UPDATE ${this.DbStorage[name].Table} SET ${itemName} = ? WHERE key = ?`,
          [newValue, key]
        )
      }

      delete(name:string, key:number) { //Delete the item using the key
        return this.DatabaseConnection.run(
          `DELETE FROM ${this.DbStorage[name].Table} WHERE key = ?`,
          [key]
        );
      }

      getByColumn(name:string, ColumnName:string, ColumnValue:any) { //Find a specfic item using the name of the column and the value you are looking for
            return this.DatabaseConnection.get(`SELECT * FROM ${this.DbStorage[name].Table} WHERE ${ColumnName} = ?`,
                [ColumnValue]);
      }

      getAll(name:string) { //Gets all items from DB
        return this.DatabaseConnection.all(`SELECT * FROM ${this.DbStorage[name].Table}`)
      }

      customQuery(query){ //Custom Query just incase I want to use it
        return this.DatabaseConnection.run(query);
      }

  }
  
export {DatabaseManager};