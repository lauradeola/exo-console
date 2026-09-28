"use strict";

function errorHandler(err, req, res, next) {
    console.error("EXO ERROR:", err);

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal server error",
        timestamp: new Date().toISOString()
    });
}

module.exports = errorHandler;