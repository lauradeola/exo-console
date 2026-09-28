"use strict";

const securityService =
    require("../services/securityService");

function getSecurity(req, res, next) {

    try {

        const data =
            securityService.getSecurityData();

        res.json(data);

    } catch (error) {

        next(error);

    }
}

module.exports = {
    getSecurity
};