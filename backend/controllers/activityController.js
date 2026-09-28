"use strict";

const activityService =
    require("../services/activityService");

function getActivity(req, res, next) {

    try {

        const data =
            activityService.getActivity();

        res.json(data);

    } catch (error) {

        next(error);

    }
}

module.exports = {
    getActivity
};