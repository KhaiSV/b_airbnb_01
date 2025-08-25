const express = require("express");
const router = express.Router();
const homestayController = require("../controllers/homestayController");

router.get("/:id", homestayController.getHomestayById);

module.exports = router;