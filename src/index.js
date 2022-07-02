if (process.env.NODE_ENV == 'production') {
  require('dotenv').config();
} else {
  require('dotenv').config({
    path: `${__dirname}/config/envs/development.env`,
  });
}

const fs = require('fs');
const path = require('path');
const { initClient } = require('./config/client');
const { initCommands } = require('./config/commands');

const commandPath = path.resolve(__dirname, './commands');
const commandFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith('.js'));

const commands = commandFiles.map((file) => require(`${commandPath}/${file}`));
const commandsData = commands.map((command) => command.data);

async function main() {
  await initCommands(commandsData);
  initClient(commands);
}

main();
