


class DatabaseManager {
  DatabaseConnection: any;
  Table: string
  Columns: string;
  QuestionMarkArray: string
    constructor(db) {
      this.DatabaseConnection = db //Connection to the Database class itself
      this.Table = undefined; //Store the table for this instance of DBManager
      this.Columns = ''; //Stores the Column Data so we can dynamically create new DBManagers
      this.QuestionMarkArray = ''; //Not a actual Array
    }
  
    createTable(_Table, Columns) {
      this.Table = _Table; //Table name
      this.Columns = Columns; //Column Data
      var _length = this.Columns.split(",").length - 1; //Get the number of columns by getting how many comma separations their are
      for(var i = 0; i < _length; i++){ //Build a string with the Question marks
        this.QuestionMarkArray += ", ?"; //Add the Question marks
      }
      const sql = `CREATE TABLE IF NOT EXISTS ${this.Table} (key INTEGER PRIMARY KEY AUTOINCREMENT, ${this.Columns})` //Create a Table with passed values
      return this.DatabaseConnection.run(sql)//Pass sql to Database
    }

    create(params = []) { //Create a new item using the Classes Table, Column Data and Questionmark Array built from the Columns. We only need to pass in the params
        return this.DatabaseConnection.run( `INSERT INTO ${this.Table} (${this.Columns}) VALUES(null${this.QuestionMarkArray})`, params);
      }


      update(itemName, newValue, key) { //update a element using the Name of the Column item and the key of the item.
        return this.DatabaseConnection.run(
          `UPDATE ${this.Table} SET ${itemName} = ? WHERE key = ?`,
          [newValue, key]
        )
      }

      delete(key) { //Delete the item using the key
        return this.DatabaseConnection.run(
          `DELETE FROM ${this.Table} WHERE key = ?`,
          [key]
        );
      }

      getByColumn(ColumnName, ColumnValue) { //Find a specfic item using the name of the column and the value you are looking for
            return this.DatabaseConnection.get(`SELECT * FROM ${this.Table} WHERE ${ColumnName} = ?`,
                [ColumnValue]);
      }

      getAll() { //Gets all items from DB
        return this.DatabaseConnection.all(`SELECT * FROM ${this.Table}`)
      }

      customQuery(query){ //Custom Query just incase I want to use it
        return this.DatabaseConnection.run(query);
      }

  }
  
export {DatabaseManager};