"use strict";

function getSecurityData() {

    return {

        status: "secure",

        score: "A+",

        threats: 0,

        checks: [
            {
                name: "Core protection",
                status: "active"
            },

            {
                name: "Network monitoring",
                status: "active"
            },

            {
                name: "Access control",
                status: "active"
            },

            {
                name: "Data integrity",
                status: "verified"
            }
        ],

        timestamp: new Date().toISOString()
    };
}

module.exports = {
    getSecurityData
};