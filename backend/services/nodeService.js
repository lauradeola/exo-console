"use strict";

function getNodes() {

    return [

        {
            id: "EXO-NODE-001",
            status: "online",
            type: "core"
        },

        {
            id: "EXO-NODE-024",
            status: "online",
            type: "intelligence"
        },

        {
            id: "EXO-NODE-051",
            status: "online",
            type: "network"
        },

        {
            id: "EXO-NODE-074",
            status: "online",
            type: "security"
        },

        {
            id: "EXO-NODE-103",
            status: "online",
            type: "analysis"
        }

    ];

}


module.exports = {
    getNodes
};