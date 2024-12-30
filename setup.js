import { createInterface } from 'readline';
import fs from 'fs';
import axios from 'axios';

const TEXT_COLORS = { YELLOW: '\x1b[33m', RESET_COLOR: '\x1b[0m' };

function centerAlignText(text, width) {
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(padding);
}

function printHeader() {
    const terminalWidth = process.stdout.columns || 80;
    console.log("");
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("****************************************", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("OasisAI bot", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("github.com/recitativonika", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log(`${TEXT_COLORS.YELLOW}${centerAlignText("****************************************", terminalWidth)}${TEXT_COLORS.RESET_COLOR}`);
    console.log("");
}

printHeader();

function logger(message, detail = "", level = "info") {
    const colors = {
        info: '\x1b[32m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        reset: '\x1b[0m'
    };

    const formattedMessage = detail ? `${message}: ${detail}` : message;
    console[level](`${colors[level] || colors.info}${formattedMessage}${colors.reset}`);
}

function readProxies(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                logger('Error reading file', err.message, 'error');
                return reject(err);
            }

            const proxies = data
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (proxies.length === 0) {
                logger("No valid proxies found in the file.", "", "warn");
            } else {
                logger(`Found ${proxies.length} valid proxies`, "", "info");
            }

            resolve(proxies);
        });
    });
}

function readAccounts(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                logger('Error reading file', err.message, 'error');
                return reject(err);
            }

            const accounts = data
                .split('\n')
                .map(line => {
                    const [email, password] = line.split(',').map(part => part.trim());
                    return email && password ? { email, password } : null;
                })
                .filter(account => account !== null);

            if (accounts.length === 0) {
                logger("No valid accounts found in the file.", "", "warn");
            } else {
                logger(`Found ${accounts.length} valid accounts`, "", "info");
            }

            resolve(accounts);
        });
    });
}

function saveData(email, token, provider, proxy) {
    const data = `${email},${token},${provider},${proxy}\n`;
    fs.appendFile('data.txt', data, (err) => {
        if (err) {
            logger('Failed to save data', err.message, 'error');
        }
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
}

async function connectWithToken(token) {
    const url = 'https://api.oasis.ai/internal/authConnect?batch=1';
    const randomId = generateRandomId();
    const payload = {
        "0": {
            "json": {
                "name": randomId,
                "platform": "headless"
            }
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const logToken = response.data[0].result.data.json;

        return logToken;
    } catch (error) {
        logger('Provider creation failed', error.response ? error.response.status : error.response.statusText, 'error');
        return null;
    }
}

async function createProviders(numID, email, password, useProxy, proxies, providersPerProxy) {
    try {
        let token = null;

        for (let i = 0; i < numID; i++) {
            if (i % 10 === 0) {
                token = await loginUser(email, password);

                if (!token) {
                    logger("Failed to get token", "", "error");
                    return false;
                }
            }

            const providerNumber = i + 1;

            const provider = await connectWithToken(token);

            if (provider) {
                const proxyValue = useProxy ?
                    proxies[Math.floor(i / providersPerProxy) % proxies.length] : 'proxy';

                saveData(email, token, provider, proxyValue);
                logger(`Provider ${providerNumber} created and data saved`, "", "info");
            } else {
                logger(`Failed to create provider ${providerNumber}`, "", "error");
                continue;
            }

            await delay(1000);
        }
        return true;
    } catch (error) {
        logger("Error connecting", error.message, 'error');
        return false;
    }
}

async function loginUser(email, password) {
    const url = 'https://api.oasis.ai/internal/authLogin?batch=1';
    const payload = {
        "0": {
            "json": {
                email: email,
                password: password,
                rememberSession: true
            }
        }
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, payload, { headers });
        logger('Logged in', email, 'info');
        return response.data[0].result.data.json.token;
    } catch (error) {
        let errorMessage = 'Unknown error';
        if (error.response && error.response.data) {
            const errorData = error.response.data[0];
            if (errorData.error && errorData.error.json && errorData.error.json.message) {
                errorMessage = errorData.error.json.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        logger(`Login error for ${email}: ${errorMessage}`, '', 'error');
        logger('Verify your email first', email, 'warn');
        return null;
    }
}

async function registerUser(email, password) {
    const url = 'https://api.oasis.ai/internal/authSignup?batch=1';
    const payload = {
        "0": {
            "json": {
                email: email,
                password: password,
                referralCode: "aidal1802"
            }
        }
    };
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, payload, { headers });
        if (response.data[0].result) {
            logger('Registration successful', email, 'info');
            logger('Verify your email', '', 'info');
            return true;
        }
    } catch (error) {
        let errorMessage = 'Unknown error';
        if (error.response && error.response.data) {
            const errorData = error.response.data[0];
            if (errorData.error && errorData.error.json && errorData.error.json.message) {
                errorMessage = errorData.error.json.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        logger(`Registration error for ${email}: ${errorMessage}`, '', 'error');
        return null;
    }
}

async function setup() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askQuestion(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }

    console.log("\x1b[36mWelcome to the Setup!\x1b[0m");

    const useProxyInput = await askQuestion('Do you want to use a proxy? (y/n): ');
    const useProxy = useProxyInput.trim().toLowerCase() === 'y';

    let proxies = [];
    let providersPerProxy = 0;

    if (useProxy) {
        proxies = await readProxies("proxy.txt");
        if (proxies.length === 0) {
            logger('No proxies found. Exiting', "", "error");
            rl.close();
            return;
        }

        const providersPerProxyInput = await askQuestion('How many providers should be generated for each proxy? ');
        providersPerProxy = parseInt(providersPerProxyInput, 10);

        if (isNaN(providersPerProxy) || providersPerProxy < 1) {
            logger("Invalid input. Enter a valid number", "", "error");
            rl.close();
            return;
        }
    }

    const input = await askQuestion('Total providers to generate? (1-100): ');
    const numProv = parseInt(input, 10);

    if (isNaN(numProv) || numProv < 1 || numProv > 100) {
        logger("Input must be between 1 and 100", "", "error");
        rl.close();
        return;
    }

    try {
        const accounts = await readAccounts('user.txt');

        for (const account of accounts) {
            logger(`Processing account: ${account.email}`, "", "info");
            const initialToken = await loginUser(account.email, account.password);

            if (initialToken) {
                await createProviders(numProv, account.email, account.password, useProxy, proxies, providersPerProxy);
            } else {
                logger(`Failed to login: ${account.email}`, "", "error");
                const registered = await registerUser(account.email, account.password);
                if (registered) {
                    logger(`Verify email for: ${account.email} and try again`, "", "warn");
                }
            }
        }
    } catch (error) {
        logger("Error processing accounts", error.message, "error");
    }

    rl.close();
}

setup();
