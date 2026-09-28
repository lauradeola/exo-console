"use strict";

function getNetworkData() {

    const latency =
        Math.floor(12 + Math.random() * 20);

    const traffic =
        Math.floor(40 + Math.random() * 50);

    return {

        status: "online",

        latency,

        traffic,

        connections:
            80 + Math.floor(Math.random() * 30),

        timestamp:
            new Date().toISOString()
    };
}

module.exports = {
    getNetworkData
};