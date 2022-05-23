class Products {
    constructor(db, _table) {
      this.dao = db
      this.Table = _table;
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS ${this.Table} ( id TEXT PRIMARY KEY, name TEXT)`
      return this.dao.run(sql)
    }

    create(id, name) {
        return this.dao.run(
          `INSERT INTO ${this.Table} (id, name) VALUES(?, ?)`,
          [id, name])
      }


      update(name, id) {
        return this.dao.run(
          `UPDATE ${this.Table} SET name = ? WHERE id = ?`,
          [name, id]
        )
      }

      delete(id) {
        return this.dao.run(
          `DELETE FROM ${this.Table} WHERE id = ?`,
          [id]
        )
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