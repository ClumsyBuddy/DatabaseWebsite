


class DatabaseManager {
  DatabaseConnection: any;
  KeyCounter:number;
  DbStorage:object;
  
  

    constructor(db) {
      this.DatabaseConnection = db //Connection to the Database class itself    
    }
  
    createTable(name, _Table, Columns) {
      var _length = Columns.split(",").length - 1; //Get the number of columns by getting how many comma separations their are
      var QuestionMarkArray = '';
      for(var i = 0; i < _length; i++){ //Build a string with the Question marks
        QuestionMarkArray += ", ?"; //Add the Question marks
      }

      Object.assign(this.DbStorage, {
        [name]:{
          Table:_Table,
          Columns:Columns,
          QuestionMarkArray:QuestionMarkArray
        }})

      const sql = `CREATE TABLE IF NOT EXISTS ${this.DbStorage[name].Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${this.DbStorage[name].Columns})` //Create a Table with passed values
      return this.DatabaseConnection.run(sql)//Pass sql to Database
    }

    create(name, params = []) { //Create a new item using the Classes Table, Column Data and Questionmark Array built from the Columns. We only need to pass in the params
        return this.DatabaseConnection.run( `INSERT INTO ${this.DbStorage[name].Table} (${this.DbStorage[name].Columns}) VALUES(null${this.DbStorage[name].QuestionMarkArray})`, params);
      }


      update(name, itemName, newValue, key) { //update a element using the Name of the Column item and the key of the item.
        return this.DatabaseConnection.run(
          `UPDATE ${this.DbStorage[name].Table} SET ${itemName} = ? WHERE key = ?`,
          [newValue, key]
        )
      }

      delete(name, key) { //Delete the item using the key
        return this.DatabaseConnection.run(
          `DELETE FROM ${this.DbStorage[name].Table} WHERE key = ?`,
          [key]
        );
      }

      getByColumn(name, ColumnName, ColumnValue) { //Find a specfic item using the name of the column and the value you are looking for
            return this.DatabaseConnection.get(`SELECT * FROM ${this.DbStorage[name].Table} WHERE ${ColumnName} = ?`,
                [ColumnValue]);
      }

      getAll(name) { //Gets all items from DB
        return this.DatabaseConnection.all(`SELECT * FROM ${this.DbStorage[name].Table}`)
      }

      customQuery(query){ //Custom Query just incase I want to use it
        return this.DatabaseConnection.run(query);
      }

  }
  
export {DatabaseManager};