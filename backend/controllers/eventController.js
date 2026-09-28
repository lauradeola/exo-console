"use strict";

const eventService =
    require("../services/eventService");


function getEvents(req, res, next) {

    try {

        const events =
            eventService.getEvents();

        res.json({
            count: events.length,
            events
        });

    } catch (error) {

        next(error);

    }

}


module.exports = {
    getEvents
};