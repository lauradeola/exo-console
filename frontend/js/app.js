const EXO_API = "http://localhost:3000";

const state = {
    online: false,
    scanning: false,
    telemetry: null,
    nodes: [],
    events: [],
    history: []
};


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initClock();
    initNavigation();
    initScan();
    initRefresh();
    initBackend();
    initNetworkTopology();

});


/* =========================================================
   CLOCK
========================================================= */

function initClock() {

    const clock = document.querySelector("#systemTime");

    if (!clock) return;

    function updateClock() {

        const now = new Date();

        clock.textContent = now.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    }

    updateClock();

    setInterval(updateClock, 1000);

}


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {

    const links =
        document.querySelectorAll(".nav-link");

    const contextPage =
        document.querySelector(".context-page");


    /*
     * Cada item da sidebar aponta
     * para uma área real do EXO.
     */

    const navigationMap = {

        overview: ".hero",

        intelligence: ".telemetry-section",

        network: ".network-section",

        activity: ".activity-panel",

        security: ".systems-panel",

        settings: ".scan-status-panel"

    };


    links.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();


            /*
             * Remove o estado ativo
             * dos outros links.
             */

            links.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            /*
             * Ativa o item selecionado.
             */

            link.classList.add("active");


            const section =
                link.dataset.section ||
                "overview";


            /*
             * Atualiza o contexto
             * no topo da interface.
             */

            if (contextPage) {

                contextPage.textContent =
                    section.toUpperCase();

            }


            /*
             * Localiza a área correspondente.
             */

            const selector =
                navigationMap[section];


            if (!selector) {
                return;
            }


            const target =
                document.querySelector(
                    selector
                );


            if (!target) {
                return;
            }


            /*
             * Faz uma navegação suave
             * até a área.
             */

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /*
     * Atualiza automaticamente o item
     * ativo conforme o usuário rola
     * pela plataforma.
     */

    const sections = [

        {
            name: "overview",
            selector: ".hero"
        },

        {
            name: "intelligence",
            selector: ".telemetry-section"
        },

        {
            name: "network",
            selector: ".network-section"
        },

        {
            name: "activity",
            selector: ".activity-panel"
        },

        {
            name: "security",
            selector: ".systems-panel"
        },

        {
            name: "settings",
            selector: ".scan-status-panel"
        }

    ];


    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 180;


        let currentSection =
            "overview";


        sections.forEach(section => {

            const element =
                document.querySelector(
                    section.selector
                );


            if (!element) {
                return;
            }


            const top =
                element.offsetTop;


            if (
                scrollPosition >= top
            ) {

                currentSection =
                    section.name;

            }

        });


        links.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section ===
                currentSection
            );

        });


        if (contextPage) {

            contextPage.textContent =
                currentSection.toUpperCase();

        }

    }


    let scrollTicking = false;

    window.addEventListener(
        "scroll",
        () => {

            if (scrollTicking) {
                return;
            }

            scrollTicking = true;

            requestAnimationFrame(() => {

                updateActiveNavigation();

                scrollTicking = false;

            });

        },
        { passive: true }
    );


    updateActiveNavigation();

}


/* =========================================================
   REFRESH BUTTON
========================================================= */

function initRefresh() {

    const button =
        document.querySelector("#refreshBtn");

    if (!button) return;

    button.addEventListener("click", async () => {

        button.classList.add("spin");

        await Promise.all([
            refreshSystem(),
            refreshTelemetry(),
            refreshNodes(),
            refreshEvents(),
            refreshScanStatus(),
            refreshHistory()
        ]);

        setTimeout(() => {

            button.classList.remove(
                "spin"
            );

        }, 500);

    });

}


/* =========================================================
   BACKEND
========================================================= */

function initBackend() {

    refreshSystem();
    refreshTelemetry();
    refreshNodes();
    refreshEvents();
    refreshScanStatus();
    refreshHistory();

    setInterval(refreshSystem, 10000);
    setInterval(refreshTelemetry, 5000);
    setInterval(refreshNodes, 5000);
    setInterval(refreshEvents, 7000);
    setInterval(refreshScanStatus, 2000);
    setInterval(refreshHistory, 3000);

}


/* =========================================================
   SYSTEM
========================================================= */

async function refreshSystem() {

    try {

        const response =
            await fetch(`${EXO_API}/api/system`);

        if (!response.ok) {
            throw new Error("System unavailable");
        }

        const data =
            await response.json();

        state.online = true;

        updateSystemStatus(data);

    } catch (error) {

        state.online = false;

        updateSystemOffline();

        console.warn(
            "EXO System:",
            error.message
        );

    }

}


function updateSystemStatus(data) {

    const statusElements =
        document.querySelectorAll(
            "[data-system-status], .system-status"
        );

    statusElements.forEach(element => {

        element.textContent =
            data.status || "ONLINE";

    });

    const uptime =
        document.querySelector(
            "[data-uptime]"
        );

    if (
        uptime &&
        data.startedAt
    ) {

        uptime.textContent =
            formatUptime(data.startedAt);

    }

}


function updateSystemOffline() {

    const elements =
        document.querySelectorAll(
            "[data-system-status], .system-status"
        );

    elements.forEach(element => {

        element.textContent =
            "OFFLINE";

    });

}


/* =========================================================
   TELEMETRY
========================================================= */

async function refreshTelemetry() {

    try {

        const response =
            await fetch(
                `${EXO_API}/api/telemetry`
            );

        if (!response.ok) {
            throw new Error(
                "Telemetry unavailable"
            );
        }

        const data =
            await response.json();

        state.telemetry = data;

        updateTelemetry(data);

    } catch (error) {

        console.warn(
            "EXO Telemetry:",
            error.message
        );

    }

}


function updateTelemetry(data) {

    updateMetric(
        "nodes",
        data.nodes
    );

    updateMetric(
        "events",
        data.events
    );

    updateMetric(
        "activity",
        `${data.activity}%`
    );

    updateMetric(
        "signals",
        `${data.signals}%`
    );

}


function updateMetric(name, value) {

    const element =
        document.querySelector(
            `[data-metric="${name}"]`
        );

    if (!element) return;

    const newValue =
        String(value ?? "--");

    if (
        element.textContent !==
        newValue
    ) {

        element.classList.remove(
            "metric-update"
        );

        void element.offsetWidth;

        element.classList.add(
            "metric-update"
        );

    }

    element.textContent =
        newValue;

}


/* =========================================================
   NODES
========================================================= */

async function refreshNodes() {

    try {

        const response =
            await fetch(
                `${EXO_API}/api/nodes`
            );

        if (!response.ok) {
            throw new Error(
                "Nodes unavailable"
            );
        }

        const nodes =
            await response.json();

        state.nodes = nodes;

        renderNodes(nodes);
        updateNetworkTopology(nodes);

    } catch (error) {

        console.warn(
            "EXO Nodes:",
            error.message
        );

    }

}


function renderNodes(nodes) {

    const container =
        document.querySelector(
            "[data-nodes]"
        );

    if (!container) return;

    if (!nodes.length) {

        container.innerHTML = `
            <div class="telemetry-empty">
                NO NODES DETECTED
            </div>
        `;

        return;

    }

    container.innerHTML =
        nodes.map(node => {

            const activity =
                Number(node.activity) || 0;

            const signal =
                Number(node.signal) || 0;

            const standby =
                node.status === "STANDBY";

            return `

                <article
                    class="
                        exo-node
                        ${standby ? "standby" : ""}
                    "
                    data-node-id="${escapeHTML(node.id)}"
                >

                    <div class="node-header">

                        <div>

                            <span class="node-id">
                                ${escapeHTML(node.id)}
                            </span>

                            <strong class="node-name">
                                ${escapeHTML(node.name)}
                            </strong>

                        </div>

                        <span class="node-status">
                            ${escapeHTML(node.status)}
                        </span>

                    </div>


                    <div class="node-meta">

                        <span>
                            ${escapeHTML(node.type || "NETWORK")}
                        </span>

                        <span>
                            SIGNAL ${signal}%
                        </span>

                    </div>


                    <div class="node-data">

                        <div class="node-stat">

                            <div>

                                <span>
                                    ACTIVITY
                                </span>

                                <strong>
                                    ${activity}%
                                </strong>

                            </div>

                            <div class="node-progress">

                                <span
                                    style="
                                        width:${activity}%
                                    "
                                ></span>

                            </div>

                        </div>


                        <div class="node-stat">

                            <div>

                                <span>
                                    SIGNAL
                                </span>

                                <strong>
                                    ${signal}%
                                </strong>

                            </div>

                            <div class="node-progress">

                                <span
                                    style="
                                        width:${signal}%
                                    "
                                ></span>

                            </div>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   EVENTS
========================================================= */

async function refreshEvents() {

    try {

        const response =
            await fetch(
                `${EXO_API}/api/events`
            );

        if (!response.ok) {
            throw new Error(
                "Events unavailable"
            );
        }

        const data =
            await response.json();

        state.events =
            Array.isArray(data)
                ? data
                : data.events || [];

        renderEvents(
            state.events
        );

    } catch (error) {

        console.warn(
            "EXO Events:",
            error.message
        );

    }

}


function renderEvents(events) {

    const container =
        document.querySelector(
            "[data-events]"
        );

    if (!container) return;

    if (!events.length) {

        container.innerHTML = `
            <div class="telemetry-empty">
                WAITING FOR EVENTS...
            </div>
        `;

        return;

    }

    container.innerHTML =
        events
            .slice(0, 8)
            .map(event => {

                const time =
                    event.timestamp
                        ? formatTime(
                            event.timestamp
                        )
                        : "--:--:--";

                return `

                    <div class="activity-item">

                        <div class="activity-marker"></div>

                        <div class="activity-content">

                            <div class="activity-top">

                                <strong>
                                    ${escapeHTML(
                                        event.title ||
                                        event.message ||
                                        "System event"
                                    )}
                                </strong>

                                <span>
                                    ${time}
                                </span>

                            </div>

                            <p>
                                ${escapeHTML(
                                    event.message ||
                                    event.description ||
                                    ""
                                )}
                            </p>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   SCAN
========================================================= */

function initScan() {

    const button =
        document.querySelector(
            "[data-scan], #scanButton, #initializeBtn"
        );

    if (!button) return;

    button.addEventListener(
        "click",
        executeScan
    );

    document.addEventListener(
        "keydown",
        event => {

            const target =
                event.target;

            const isTyping =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;

            if (
                event.key.toLowerCase() === "s" &&
                !state.scanning &&
                !isTyping
            ) {

                executeScan();

            }

        }
    );

}


async function executeScan() {

    if (state.scanning) {
        return;
    }

    const button =
        document.querySelector(
            "[data-scan], #scanButton, #initializeBtn"
        );

    if (!button) return;

    state.scanning = true;

    const originalHTML =
        button.innerHTML;

    button.innerHTML = `
        <span>
            Scanning network...
        </span>

        <span class="button-arrow">
            ◌
        </span>
    `;

    button.disabled = true;

    try {

        const response =
            await fetch(
                `${EXO_API}/api/scan`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Scan failed"
            );
        }

        await response.json();

        await Promise.all([
            refreshTelemetry(),
            refreshNodes(),
            refreshEvents(),
            refreshScanStatus(),
            refreshHistory()
        ]);

    } catch (error) {

        console.error(
            "EXO Scan:",
            error
        );

    } finally {

        setTimeout(() => {

            button.innerHTML =
                originalHTML;

            button.disabled =
                false;

            state.scanning =
                false;

        }, 500);

    }

}


/* =========================================================
   SCAN STATUS
========================================================= */

async function refreshScanStatus() {

    try {

        const response =
            await fetch(
                `${EXO_API}/api/scan/status`
            );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        const count =
            document.querySelector(
                "[data-scan-count]"
            );

        const lastScan =
            document.querySelector(
                "[data-last-scan]"
            );

        if (count) {

            count.textContent =
                data.totalScans ?? 0;

        }

        if (lastScan) {

            lastScan.textContent =
                data.lastScan
                    ? formatTime(
                        data.lastScan
                    )
                    : "NEVER";

        }

    } catch (error) {

        console.warn(
            "EXO Scan Status:",
            error.message
        );

    }

}


/* =========================================================
   TELEMETRY HISTORY
========================================================= */

async function refreshHistory() {

    try {

        const response =
            await fetch(
                `${EXO_API}/api/telemetry/history`
            );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        state.history =
            Array.isArray(data)
                ? data
                : data.history || [];

        renderTelemetryChart(
            state.history
        );

    } catch (error) {

        console.warn(
            "EXO History:",
            error.message
        );

    }

}


function renderTelemetryChart(history) {

    const container =
        document.querySelector(
            "[data-telemetry-chart]"
        );

    if (!container) return;

    if (
        !Array.isArray(history) ||
        history.length < 2
    ) {

        container.innerHTML = `
            <div class="telemetry-empty">
                COLLECTING TELEMETRY...
            </div>
        `;

        return;

    }

    const width = 1000;
    const height = 320;

    const values =
        history.slice(-30);

    const activity =
        values.map(
            item =>
                Number(item.activity) || 0
        );

    const signals =
        values.map(
            item =>
                Number(item.signals) || 0
        );

    const min =
        Math.min(
            ...activity,
            ...signals
        );

    const max =
        Math.max(
            ...activity,
            ...signals
        );

    const range =
        Math.max(
            max - min,
            10
        );


    function createPoints(values) {

        return values
            .map((value, index) => {

                const x =
                    (index /
                        Math.max(
                            values.length - 1,
                            1
                        )
                    ) *
                    width;

                const y =
                    height -
                    (
                        (value - min) /
                        range
                    ) *
                    (
                        height - 30
                    ) -
                    15;

                return `${x},${y}`;

            })
            .join(" ");

    }


    const activityPoints =
        createPoints(activity);

    const signalPoints =
        createPoints(signals);


    let grid = "";

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            (height / 4) * i;

        grid += `
            <line
                x1="0"
                y1="${y}"
                x2="${width}"
                y2="${y}"
                class="chart-grid-line"
            />
        `;

    }


    container.innerHTML = `

        <div class="telemetry-chart-header">

            <div>

                <span class="panel-label">
                    LIVE TELEMETRY
                </span>

                <h3>
                    System performance
                </h3>

            </div>


            <div class="telemetry-legend">

                <span>
                    <i class="legend-activity"></i>
                    ACTIVITY
                </span>

                <span>
                    <i class="legend-signal"></i>
                    SIGNAL
                </span>

            </div>

        </div>


        <div class="telemetry-graph">

            <svg
                viewBox="0 0 ${width} ${height}"
                preserveAspectRatio="none"
                aria-label="EXO telemetry chart"
            >

                ${grid}

                <polyline
                    points="${activityPoints}"
                    class="chart-line chart-activity"
                />

                <polyline
                    points="${signalPoints}"
                    class="chart-line chart-signal"
                />

            </svg>

        </div>

    `;

}


/* =========================================================
   NETWORK TOPOLOGY
========================================================= */

function initNetworkTopology() {

    const networkNodes =
        document.querySelectorAll(
            "[data-network-node]"
        );

    const inspector =
        document.querySelector(
            "[data-network-inspector]"
        );

    if (
        !networkNodes.length ||
        !inspector
    ) {
        return;
    }


    networkNodes.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const nodeId =
                    button.dataset.networkNode;

                selectNetworkNode(
                    nodeId
                );

            }
        );

    });

}


function updateNetworkTopology(nodes) {

    const networkNodes =
        document.querySelectorAll(
            "[data-network-node]"
        );

    networkNodes.forEach(button => {

        const nodeId =
            button.dataset.networkNode;

        const node =
            nodes.find(
                item =>
                    item.id === nodeId
            );

        if (!node) {
            return;
        }


        const isStandby =
            node.status === "STANDBY";


        const core =
            button.querySelector(
                ".node-core"
            );


        if (isStandby) {

            button.classList.add(
                "standby"
            );

            if (core) {

                core.style.background =
                    "#6d7375";

                core.style.boxShadow =
                    "0 0 8px rgba(109,115,117,.4)";

            }

        } else {

            button.classList.remove(
                "standby"
            );

            if (core) {

                core.style.background =
                    "";

                core.style.boxShadow =
                    "";

            }

        }


        const activity =
            Number(node.activity) || 0;


        button.style.setProperty(
            "--node-activity",
            activity
        );

    });

}


function selectNetworkNode(nodeId) {

    const node =
        state.nodes.find(
            item =>
                item.id === nodeId
        );

    if (!node) {
        return;
    }


    const networkNodes =
        document.querySelectorAll(
            "[data-network-node]"
        );


    networkNodes.forEach(button => {

        const selected =
            button.dataset.networkNode ===
            nodeId;

        button.classList.toggle(
            "selected",
            selected
        );

        button.dataset.selected =
            selected
                ? "true"
                : "false";

    });


    renderNetworkInspector(
        node
    );

}


function renderNetworkInspector(node) {

    const inspector =
        document.querySelector(
            "[data-network-inspector]"
        );

    if (!inspector) {
        return;
    }


    const activity =
        Number(node.activity) || 0;

    const signal =
        Number(node.signal) || 0;


    const status =
        String(
            node.status || "UNKNOWN"
        );


    inspector.innerHTML = `

        <span class="eyebrow">
            NODE INSPECTOR
        </span>


        <div class="inspector-content">


            <div class="inspector-node-title">

                <div>

                    <strong>
                        ${escapeHTML(node.id)}
                    </strong>

                    <div
                        style="
                            margin-top:5px;
                            color:var(--muted);
                            font-size:11px;
                        "
                    >
                        ${escapeHTML(node.name)}
                    </div>

                </div>


                <span>
                    ${escapeHTML(status)}
                </span>

            </div>



            <div class="inspector-stats">


                <div class="inspector-stat">

                    <div style="width:100%;">

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                            "
                        >

                            <span>
                                Activity
                            </span>

                            <strong>
                                ${activity}%
                            </strong>

                        </div>


                        <div class="inspector-bar">

                            <span
                                style="
                                    --value:${activity}%
                                "
                            ></span>

                        </div>

                    </div>

                </div>



                <div class="inspector-stat">

                    <div style="width:100%;">

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                            "
                        >

                            <span>
                                Signal
                            </span>

                            <strong>
                                ${signal}%
                            </strong>

                        </div>


                        <div class="inspector-bar">

                            <span
                                style="
                                    --value:${signal}%
                                "
                            ></span>

                        </div>

                    </div>

                </div>



                <div class="inspector-stat">

                    <span>
                        Type
                    </span>

                    <strong>
                        ${escapeHTML(
                            node.type ||
                            "NETWORK"
                        )}
                    </strong>

                </div>



                <div class="inspector-stat">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${escapeHTML(status)}
                    </strong>

                </div>


            </div>

        </div>

    `;

}


/* =========================================================
   HELPERS
========================================================= */

function formatTime(timestamp) {

    if (!timestamp) {
        return "--:--:--";
    }

    const date =
        new Date(timestamp);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "--:--:--";
    }

    return date.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}


function formatUptime(startedAt) {

    const start =
        new Date(startedAt);

    const now =
        new Date();

    const seconds =
        Math.floor(
            (now - start) / 1000
        );

    if (seconds < 0) {
        return "--";
    }

    const hours =
        Math.floor(
            seconds / 3600
        );

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;

    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(secs).padStart(2, "0")
    ].join(":");

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   EXO START
========================================================= */

console.log(
    "%cEXO Intelligence Platform",
    "color:#d8ff3e;font-weight:bold;font-size:16px;"
);

console.log(
    "%cNetwork intelligence engine initialized.",
    "color:#7e8587;"
);