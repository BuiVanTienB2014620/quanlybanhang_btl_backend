const express = require("express");

const orderdetails = require("../controllers/orderdetail.controller");

const router = express.Router();

router.route("/")
    .get(orderdetails.findAll)
    .post(orderdetails.create)
    .delete(orderdetails.deleteAll);

// router.route("/TrangThaiDH")
//     .get(orderdetails.findAllTrangThaiDH);

router.route("/:id")
     .get(orderdetails.findOne)
     .put(orderdetails.update)
     .delete(orderdetails.delete);

module.exports = router;