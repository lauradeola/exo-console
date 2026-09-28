"use strict";

function getEvents() {

    return [

        {
            id: 1,
            type: "network",
            status: "ok",
            title: "Network scan completed",
            description:
                "Environment analyzed successfully"
        },

        {
            id: 2,
            type: "security",
            status: "ok",
            title: "Security layer verified",
            description:
                "Protection matrix operating normally"
        },

        {
            id: 3,
            type: "intelligence",
            status: "new",
            title: "Intelligence node connected",
            description:
                "New EXO node detected"
        },

        {
            id: 4,
            type: "system",
            status: "ok",
            title: "System health check",
            description:
                "All core services operational"
        }

    ];

}


module.exports = {
    getEvents
};