const express = require("express");
const products = require("../controllers/hanghoa.controller.js");
const router = express.Router();

router
  .route("/")
  .get(products.findAll)
  .post(products.create)
  .delete(products.deleteAll);



router
  .route("/:id")
  .get(products.findProductById)
  .put(products.update)
  .delete(products.delete);

module.exports = router;
