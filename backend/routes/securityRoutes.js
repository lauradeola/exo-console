"use strict";

const express = require("express");

const router = express.Router();

const securityController =
    require("../controllers/securityController");

router.get(
    "/",
    securityController.getSecurity
);

module.exports = router;