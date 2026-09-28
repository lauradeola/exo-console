"use strict";

const intelligenceService =
    require("../services/intelligenceService");

function getIntelligence(req, res, next) {

    try {

        const data =
            intelligenceService.getIntelligenceData();

        res.json(data);

    } catch (error) {

        next(error);

    }
}

module.exports = {
    getIntelligence
};