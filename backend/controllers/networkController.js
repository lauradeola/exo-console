"use strict";

const networkService =
    require("../services/networkService");

function getNetwork(req, res, next) {

    try {

        const data =
            networkService.getNetworkData();

        res.json(data);

    } catch (error) {

        next(error);

    }
}

module.exports = {
    getNetwork
};