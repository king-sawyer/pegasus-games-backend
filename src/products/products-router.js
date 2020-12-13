const path = require("path");
const express = require("express");
const xss = require("xss");
const ProductsService = require("./products-service");
const { requireAuth } = require("../middleware/jwt-auth");

const productsRouter = express.Router();
const jsonParser = express.json();

productsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ProductsService.getAllProducts(knexInstance)
      .then((products) => {
        res.json(products);
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");
    ProductsService.getAllProducts(knexInstance)
      .then((products) => {
        res.json(products);
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const {
      title,
      price,
      available,
      category,
      single,
      img,
      featured,
    } = req.body;

    const newProduct = {
      title,
      price,
      available,
      category,
      single,
      img,
      featured,
    };

    ProductsService.insertProduct(req.app.get("db"), newProduct)
      .then(res.status(201).json(newProduct))
      .catch(next);
  })
  .patch(requireAuth, (req, res, next) => {
    if (!req.body.id) {
      return res.status(400).json({
        error: {
          message: `Request must contain an id`,
        },
      });
    }
    const {
      id,
      title,
      price,
      available,
      category,
      single,
      img,
      featured,
    } = req.body;
    const productToUpdate = {
      id,
      title,
      price,
      available,
      category,
      single,
      img,
      featured,
    };
    ProductsService.updateProduct(
      req.app.get("db"),
      req.body.id,
      productToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    ProductsService.deleteProduct(req.app.get("db"), req.body.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

productsRouter.route("/admin").get(requireAuth, (req, res, next) => {
  const knexInstance = req.app.get("db");
  ProductsService.getAllProducts(knexInstance)
    .then((products) => {
      res.json(products);
    })
    .catch(next);
});

module.exports = productsRouter;
