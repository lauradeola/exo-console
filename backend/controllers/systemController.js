"use strict";

const systemService =
    require("../services/systemService");


function getSystem(req, res, next) {

    try {

        const data =
            systemService.getSystemStatus();

        res.json(data);

    } catch (error) {

        next(error);

    }

}


function getHealth(req, res, next) {

    try {

        const data =
            systemService.getHealthStatus();

        res.json(data);

    } catch (error) {

        next(error);

    }

}


module.exports = {
    getSystem,
    getHealth
};