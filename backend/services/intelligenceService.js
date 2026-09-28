"use strict";

function getIntelligenceData() {

    return {
        status: "active",

        analysis: {
            confidence: 94,
            patternsDetected: 12,
            anomalies: 3
        },

        insights: [
            {
                id: 1,
                title: "Network pattern detected",
                description: "EXO identified a recurring communication pattern.",
                priority: "medium"
            },

            {
                id: 2,
                title: "System stability confirmed",
                description: "Core services are operating within normal parameters.",
                priority: "low"
            },

            {
                id: 3,
                title: "Analysis opportunity detected",
                description: "Additional telemetry is available for processing.",
                priority: "high"
            }
        ],

        timestamp: new Date().toISOString()
    };
}

module.exports = {
    getIntelligenceData
};