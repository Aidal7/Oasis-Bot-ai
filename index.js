import fs from 'fs';
import readline from 'readline';
import WebSocket from "ws";
import { HttpsProxyAgent } from "https-proxy-agent";
import { createUniqueId as generateUniqueIdentifier, createSystemData as generateSystemInformation } from "./hw.js";

const TEXT_COLORS = {
    RESET_COLOR: "\x1b[0m",
    YELLOW: "\x1b[33m"
};

function centerAlignText(text, width) {
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(padding);
}

function printHeader() {
    const terminalWidth = process.stdout.columns || 80;
    console.log("");
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("**************************************************", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("OasisAI bot", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("github.com/recitativonika", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("**************************************************", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log("");
}

printHeader();

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m"
};

function customLogger(message) {
    console.log(message);
}

function parseDataFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);

            const entries = data.split('\n').map(line => line.trim()).filter(line => line);
            const parsedData = entries.map(entry => {
                const [email, token, providertoken, proxy] = entry.split(',');
                return { email, token, providertoken, proxy };
            });

            resolve(parsedData);
        });
    });
}

function loadAllSystemData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return {};
}

function saveAllSystemData(filePath, allData) {
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2), 'utf8');
}

async function initiateWebSocketConnection(token, useProxy, proxy = null, index, allSystemData) {
    const wsOptions = {};
    if (useProxy && proxy) {
        customLogger(`Proxy connection initiated: ${proxy}`);
        wsOptions.agent = new HttpsProxyAgent(proxy);
    }

    const socket = new WebSocket(`wss://ws.oasis.ai/?token=${token}`, wsOptions);

    socket.on("open", async () => {
        customLogger(`[${index}] WebSocket connection established for provider: ${colors.cyan}${token}${colors.reset}`);

        const systemDataFilePath = `allSystemData.json`;
        let systemData = allSystemData[index];

        if (!systemData) {
            systemData = generateSystemInformation();
            allSystemData[index] = systemData;
            saveAllSystemData(systemDataFilePath, allSystemData);
        }

        const { machineId, operatingSystem, cpuInfo } = systemData.data;
        customLogger(`[${index}] Dispatching system data: Machine ID: ${colors.green}${machineId}${colors.reset}, OS: ${operatingSystem}, CPU: ${cpuInfo.modelName}`);

        socket.send(JSON.stringify(systemData));

        setInterval(() => {
            const randomId = generateUniqueIdentifier();
            socket.send(
                JSON.stringify({
                    id: randomId,
                    type: "heartbeat",
                    data: {
                        version: "0.1.7",
                        mostRecentModel: "unknown",
                        status: "active",
                    },
                })
            );
        }, 60000);
    });

    socket.on("message", (data) => {
        const message = data.toString();
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === "serverMetrics") {
                const { totalEarnings, totalUptime, creditsEarned } = parsedMessage.data;
                customLogger(`[${index}] Heartbeat acknowledged for provider: ${colors.cyan}${token}${colors.reset}`);
                customLogger(`[${index}] Total uptime: ${colors.yellow}${totalUptime}${colors.reset} seconds | Credits earned: ${colors.magenta}${creditsEarned}${colors.reset}`);
            } else if (parsedMessage.type === "acknowledged") {
                customLogger(`[${index}] System data acknowledged`);
            } else if (parsedMessage.type === "error" && parsedMessage.data.code === "Invalid body") {
                const systemData = generateSystemInformation();
                allSystemData[index] = systemData;
                saveAllSystemData(systemDataFilePath, allSystemData);
                socket.send(JSON.stringify(systemData));
            }
        } catch (error) {
            customLogger("Error parsing incoming message");
        }
    });

    socket.on("close", () => {
        customLogger(`WebSocket connection closed for token: ${token}`);
        setTimeout(() => {
            customLogger(`Reconnecting for token: ${token}`);
            initiateWebSocketConnection(token, useProxy, proxy, index, allSystemData);
        }, 5000);
    });

    socket.on("error", (error) => {
        customLogger(`WebSocket error for token: ${token} - ${error.message}`);
        setTimeout(() => {
            customLogger(`Attempting to reconnect for token: ${token}`);
            initiateWebSocketConnection(token, useProxy, proxy, index, allSystemData);
        }, 5000);
    });
}

async function launchProcess() {
    try {
        const data = await parseDataFile("data.txt");
        const systemDataFilePath = `allSystemData.json`;
        const allSystemData = loadAllSystemData(systemDataFilePath);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Would you like to use a proxy? (y/n): ', async (answer) => {
            const useProxy = answer.toLowerCase() === 'y';

            data.forEach(({ token, providertoken, proxy }, index) => {
                customLogger(`[${index + 1}] Initiating connection for token: ${token} with provider token: ${colors.cyan}${providertoken}${colors.reset}`);
                initiateWebSocketConnection(providertoken, useProxy, proxy, index + 1, allSystemData);
            });

            rl.close();
        });

    } catch (error) {
        customLogger("Error reading data file");
    }
}

launchProcess();