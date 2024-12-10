# OasisAI bot

## Description
This script automates registration, create provider and websocket interaction of OasisAI.

## Features
- **Automated provider register and interaction**
- **Automatic account registration**
- **Multi account**
- **Multi provider**
- **Proxy support**

## Prerequisites
- [Node.js](https://nodejs.org/) (version 12 or higher)

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/recitativonika/oasis-ai-bot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd oasis-ai-bot
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Usage
1. Register OasisAI bot account, if you don't have account yet you can register via this link [here](https://r.distribute.ai/recitativo) or you can put email and password that you desire in `user.txt` to automatic registration.  check next part to do that.
2. Set and Modify `user.txt` with your account data. If you don't have account, you can just put email and password that you want to register and it will automatically register account for you (you still need to verify email). Put the data in `user.txt` with format like this:
   ```bash
   email1,password1
   email2,password2
   ```
   if you want to use proxy, add your proxy in `proxy.txt` with this format
   ```bash
   proxy1
   proxy2
   ip:port
   user:pass@ip:port
   http://ip:port
   http://user:pass@ip:port
   ```
3. After put data in `user.txt`, run this script
    ```bash
    node setup.js
    ```
   This script will automatically register account if you don't have account .The setup script will automatically fill and save the needed data to the `data.txt`, it will look like this:
    ```bash
    email[1],token[1]fromemail[1],provider[1]foremail[1],proxy[1]
    email[1],token[1]fromemail[1],provider[2]foremail[1],proxy[1]
    email[1],token[2]fromemail[1],provider[3]foremail[1],proxy[2]
    email[2],token[1]fromemail[2],provider[1]foremail[2],proxy[2]
    email[2],token[1]fromemail[2],provider[2]foremail[2],proxy[3]
    email[2],token[2]fromemail[2],provider[3]foremail[2],proxy[3]
    ```
   if you not use proxy when registering account and want to use proxy when run the bot, you can add it manually or rerun setup.js with proxy enabled
4. Run the script:
   ```bash
   node index.js
   ```
   Your HW data of the provider is saved in `allSystemData.json` when you running the script, please do not delete this file. If you add more provider, it will automatically add the data.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Note
This script only for testing purpose, using this script might violates ToS and may get your account permanently banned.

My reff code if you want to use :) https://r.distribute.ai/recitativo
