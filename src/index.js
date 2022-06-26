require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { initClient } = require('./config/client');
const { initCommands } = require('./config/slashCommands');

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
