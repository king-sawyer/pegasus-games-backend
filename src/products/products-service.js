const ProductsService = {
  getAllProducts(knex) {
    return knex.select("*").from("products");
  },
  insertProduct(knex, newProduct) {
    return knex
      .insert(newProduct)
      .into("products")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateProduct(knex, id, newProduct) {
    return knex("products").where({ id }).update(newProduct);
  },
  deleteProduct(knex, id) {
    return knex("products").where({ id }).delete();
  },
};

module.exports = ProductsService;
