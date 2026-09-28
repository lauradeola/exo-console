const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const startedAt = new Date();

const system = {
    name: "EXO",
    version: "1.0.0",
    status: "ONLINE",
    startedAt
};

let telemetry = {
    nodes: 5,
    events: 0,
    signals: 87,
    activity: 82
};

let scanState = {
    running: false,
    lastScan: null,
    totalScans: 0
};

const nodes = [
    {
        id: "NODE-01",
        name: "ORBIT",
        type: "PRIMARY",
        status: "ACTIVE",
        activity: 92,
        signal: 98
    },
    {
        id: "NODE-02",
        name: "VECTOR",
        type: "SECONDARY",
        status: "ACTIVE",
        activity: 81,
        signal: 91
    },
    {
        id: "NODE-03",
        name: "NOVA",
        type: "REMOTE",
        status: "ACTIVE",
        activity: 74,
        signal: 87
    },
    {
        id: "NODE-04",
        name: "AXIS",
        type: "REMOTE",
        status: "STANDBY",
        activity: 42,
        signal: 69
    },
    {
        id: "NODE-05",
        name: "PULSE",
        type: "SECONDARY",
        status: "ACTIVE",
        activity: 88,
        signal: 94
    }
];

const eventMessages = [
    "Telemetry synchronization completed",
    "Node activity updated",
    "Network signal recalculated",
    "Intelligence layer synchronized",
    "System health check completed",
    "New telemetry packet received"
];

const events = [];

const telemetryHistory = [];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addEvent(message, severity = "info", origin = "EXO CORE") {

    events.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message,
        severity,
        origin
    });

    if (events.length > 30) {
        events.pop();
    }

    telemetry.events = events.length;
}

/*
 * Verifica a saúde de um nó e dispara um evento só quando
 * a severidade MUDA (evita spam do mesmo aviso a cada tick).
 */
function checkNodeHealth(node) {

    if (node.status !== "ACTIVE") {
        return;
    }

    let severity = "info";

    if (node.activity < 30 || node.signal < 55) {
        severity = "critical";
    } else if (node.activity < 45 || node.signal < 65) {
        severity = "warning";
    }

    if (severity === node.lastHealthSeverity) {
        return;
    }

    node.lastHealthSeverity = severity;

    if (severity === "critical") {

        addEvent(
            `${node.id} critical activity drop (${node.activity}%)`,
            "critical",
            node.id
        );

    } else if (severity === "warning") {

        addEvent(
            `${node.id} signal instability detected`,
            "warning",
            node.id
        );

    } else {

        addEvent(
            `${node.id} back to nominal levels`,
            "info",
            node.id
        );

    }

}

function calculateTelemetry() {

    const activeNodes = nodes.filter(
        node => node.status === "ACTIVE"
    );

    const activityAverage =
        activeNodes.reduce(
            (total, node) => total + node.activity,
            0
        ) / activeNodes.length;

    const signalAverage =
        nodes.reduce(
            (total, node) => total + node.signal,
            0
        ) / nodes.length;

    telemetry.activity = Math.round(activityAverage);
    telemetry.signals = Math.round(signalAverage);
}

function captureTelemetry() {

    calculateTelemetry();

    telemetryHistory.push({
        time: new Date().toISOString(),
        activity: telemetry.activity,
        signal: telemetry.signals
    });

    if (telemetryHistory.length > 60) {
        telemetryHistory.shift();
    }
}


/* INITIAL DATA */

addEvent("EXO intelligence core initialized", "info", "EXO CORE");
addEvent("Network monitoring activated", "info", "EXO CORE");

captureTelemetry();


/* ROOT */

app.get("/", (req, res) => {

    res.json({
        system: "EXO",
        status: "ONLINE",
        message: "EXO Control Center"
    });

});


/* SYSTEM */

app.get("/api/system", (req, res) => {

    res.json({
        ...system,
        uptime: Date.now() - startedAt.getTime()
    });

});


/* TELEMETRY */

app.get("/api/telemetry", (req, res) => {

    calculateTelemetry();

    res.json(telemetry);

});


/* TELEMETRY HISTORY */

app.get("/api/telemetry/history", (req, res) => {

    res.json({
        points: telemetryHistory
    });

});


/* NODES */

app.get("/api/nodes", (req, res) => {

    res.json({
        count: nodes.length,
        nodes
    });

});


/* EVENTS */

app.get("/api/events", (req, res) => {

    res.json({
        count: events.length,
        events
    });

});


/* SCAN */

app.post("/api/scan", async (req, res) => {

    if (scanState.running) {

        return res.status(409).json({
            success: false,
            message: "A scan is already running"
        });

    }

    scanState.running = true;

    addEvent(
        "Network intelligence scan started",
        "info",
        "SCAN ENGINE"
    );

    await new Promise(resolve => {
        setTimeout(resolve, 1800);
    });

    nodes.forEach(node => {

        if (node.status === "ACTIVE") {

            node.activity = Math.min(
                100,
                Math.max(
                    40,
                    node.activity + random(-8, 8)
                )
            );

            node.signal = Math.min(
                100,
                Math.max(
                    50,
                    node.signal + random(-4, 4)
                )
            );

        }

    });

    nodes.forEach(checkNodeHealth);

    calculateTelemetry();

    scanState.running = false;
    scanState.lastScan = new Date().toISOString();
    scanState.totalScans++;

    captureTelemetry();

    addEvent(
        "Network scan completed successfully",
        "info",
        "SCAN ENGINE"
    );

    res.json({
        success: true,
        message: "Scan completed",
        scan: scanState,
        telemetry
    });

});


/* SCAN STATUS */

app.get("/api/scan/status", (req, res) => {

    res.json(scanState);

});


/* HEALTH */

app.get("/api/health", (req, res) => {

    res.json({
        status: "OK",
        system: "EXO",
        uptime: Date.now() - startedAt.getTime(),
        timestamp: new Date().toISOString()
    });

});


/* BACKGROUND TELEMETRY */

setInterval(() => {

    nodes.forEach(node => {

        if (node.status !== "ACTIVE") {
            return;
        }

        node.activity = Math.min(
            100,
            Math.max(
                20,
                node.activity + random(-5, 5)
            )
        );

        node.signal = Math.min(
            100,
            Math.max(
                50,
                node.signal + random(-3, 3)
            )
        );

    });

    nodes.forEach(checkNodeHealth);

    captureTelemetry();

}, 3000);


/* BACKGROUND EVENTS */

setInterval(() => {

    const message =
        eventMessages[
            random(0, eventMessages.length - 1)
        ];

    addEvent(message);

}, 9000);


/* SERVER */

app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("        EXO CONTROL CENTER");
    console.log("================================");
    console.log(`SERVER   : ONLINE`);
    console.log(`PORT     : ${PORT}`);
    console.log(`NODES    : ${nodes.length}`);
    console.log(`TELEMETRY: ACTIVE`);
    console.log(`API      : READY`);
    console.log("================================");
    console.log("");

});