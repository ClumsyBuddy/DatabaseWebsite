class Products {
    constructor(db) {
      this.dao = db
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT)`
      return this.dao.run(sql)
    }

    create(id, name) {
        return this.dao.run(
          'INSERT INTO products (id, name) VALUES(?, ?)',
          [id, name])
      }


      update(name, id) {
        return this.dao.run(
          `UPDATE products SET name = ? WHERE id = ?`,
          [name, id]
        )
      }

      delete(id) {
        return this.dao.run(
          `DELETE FROM products WHERE id = ?`,
          [id]
        )
      }

      getById(id, callback) {
            return this.dao.get(`SELECT * FROM products WHERE id = ?`,
                [id], callback);
      }

      getAll() {
        return this.dao.all(`SELECT * FROM products`)
      }

      getTasks(projectId) {
        return this.dao.all(
          `SELECT * FROM tasks WHERE projectId = ?`,
          [projectId])
      }

      customQuery(query){
        return this.dao.run(query);
      }

  }
  
  module.exports = Products;