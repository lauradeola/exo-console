"use strict";

function getSystemStatus() {

    const systemLoad =
        Math.floor(18 + Math.random() * 22);

    const activeNodes =
        124 + Math.floor(Math.random() * 12);

    const events =
        5 + Math.floor(Math.random() * 6);

    return {

        system: "EXO",

        core: {
            id: "EXO-01",
            status: "operational",
            version: "1.0.0"
        },

        metrics: {
            activeNodes,
            systemLoad,
            events,
            security: "A+"
        },

        timestamp: new Date().toISOString()

    };
}


function getHealthStatus() {

    return {

        status: "healthy",
        system: "EXO",
        core: "EXO-01",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()

    };

}


module.exports = {
    getSystemStatus,
    getHealthStatus
};