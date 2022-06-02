class Account {
    constructor(db, _table) {
      this.dao = db
      this.Table = _table;
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS ${this.Table} ( key INTEGER PRIMARY KEY AUTOINCREMENT , email TEXT, password TEXT)`
      return this.dao.run(sql)
    }

    create(email, password) {
        return this.dao.run(
          `INSERT INTO ${this.Table} (email, password) VALUES(null, ?, ?)`,
          [email, password])
      }


      update(OldOption, newOption, id) {
        return this.dao.run(
          `UPDATE ${this.Table} SET ${OldOption} = ? WHERE email = ?`,
          [newOption, id]
        )
      }

      delete(email, password) {
        return this.dao.run(
          `DELETE FROM ${this.Table} WHERE email = ? AND password = ?`,
          [id, brand, color]
        );
      }

      getById(email, callback) {
            return this.dao.get(`SELECT * FROM ${this.Table} WHERE email = ?`,
                [email], callback);
      }

      getAll() {
        return this.dao.all(`SELECT * FROM ${this.Table}`)
      }

      customQuery(query){
        return this.dao.run(query);
      }

  }
  
  module.exports = Account;