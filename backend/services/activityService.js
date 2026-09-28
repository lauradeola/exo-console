"use strict";

function getActivity() {

    return {

        activity: [

            {
                id: 1,
                title: "System initialized",
                description: "EXO core started successfully",
                status: "OK",
                timestamp: new Date().toISOString()
            },

            {
                id: 2,
                title: "Network synchronized",
                description: "Node communication established",
                status: "OK",
                timestamp: new Date().toISOString()
            },

            {
                id: 3,
                title: "Security verification",
                description: "Protection layer verified",
                status: "OK",
                timestamp: new Date().toISOString()
            }

        ]

    };
}

module.exports = {
    getActivity
};