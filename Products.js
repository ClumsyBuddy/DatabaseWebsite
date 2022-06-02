class Products {
    constructor(db, _table) {
      this.dao = db
      this.Table = _table;
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS ${this.Table} ( key INTEGER PRIMARY KEY AUTOINCREMENT , id TEXT NOT NULL, brand TEXT, color TEXT, sizes TEXT, active INTEGER, description TEXT)`
      return this.dao.run(sql)
    }

    create(id, brand, color, sizes, active, description) {
        return this.dao.run(
          `INSERT INTO ${this.Table} (key, id, brand, color, sizes, active, description) VALUES(null, ?, ?, ?, ?, ?, ?)`,
          [id, brand, color, sizes, active, description]);
      }


      update(OldOption, newOption, key) {
        return this.dao.run(
          `UPDATE ${this.Table} SET ${OldOption} = ? WHERE key = ?`,
          [newOption, key]
        )
      }

      delete(key) {
        return this.dao.run(
          `DELETE FROM ${this.Table} WHERE key = ?`,
          [key]
        );
      }

      getById(id, callback) {
            return this.dao.get(`SELECT * FROM ${this.Table} WHERE id = ?`,
                [id], callback);
      }

      getAll() {
        return this.dao.all(`SELECT * FROM ${this.Table}`)
      }

      customQuery(query){
        return this.dao.run(query);
      }

  }
  
  module.exports = Products;