const express = require("express");

const commodities = require("../controllers/commoditi.controller");

const router = express.Router();

router.route("/")
    .get(commodities.findAll)
    .post(commodities.create)
    .delete(commodities.deleteAll);

// router.route("/TrangThaiDH")
//     .get(commodities.findAllTrangThaiDH);

router.route("/:id")
     .get(commodities.findOne)
     .put(commodities.update)
     .delete(commodities.delete);

module.exports = router;