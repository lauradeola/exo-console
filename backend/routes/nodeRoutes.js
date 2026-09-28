"use strict";

const express = require("express");
const router = express.Router();

const nodeController = require("../controllers/nodeController");

router.get("/", nodeController.getNodes);

module.exports = router;