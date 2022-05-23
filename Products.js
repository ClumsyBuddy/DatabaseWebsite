class Products {
    constructor(db, _table) {
      this.dao = db
      this.Table = _table;
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS ${this.Table} ( key INTEGER PRIMARY KEY AUTOINCREMENT , id TEXT, brand TEXT, color TEXT, sizes TEXT)`
      return this.dao.run(sql)
    }

    create(id, brand, color, sizes) {
        return this.dao.run(
          `INSERT INTO ${this.Table} (key, id, brand, color, sizes) VALUES(null, ?, ?, ?, ?)`,
          [id, brand, color, sizes])
      }


      update(OldOption, newOption, id) {
        return this.dao.run(
          `UPDATE ${this.Table} SET ${OldOption} = ? WHERE id = ?`,
          [newOption, id]
        )
      }

      delete(id, brand, color) {
        return this.dao.run(
          `DELETE FROM ${this.Table} WHERE id = ? AND brand = ? AND color = ?`,
          [id, brand, color]
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