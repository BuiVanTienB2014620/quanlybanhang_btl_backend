const express = require("express");

const imgcs = require("../controllers/imgc.controller");

const router = express.Router();

router.route("/")
    .get(imgcs.findAll)
    .post(imgcs.create)
    .delete(imgcs.deleteAll);

// router.route("/TrangThaiDH")
//     .get(imgcs.findAllTrangThaiDH);

router.route("/:id")
     .get(imgcs.findOne)
     .put(imgcs.update)
     .delete(imgcs.delete);

module.exports = router;