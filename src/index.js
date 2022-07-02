if (process.env.NODE_ENV == 'production') {
  require('dotenv').config();
} else {
  require('dotenv').config({
    path: `${__dirname}/config/envs/development.env`,
  });
}

const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { initClient } = require('./config/client');
const { initCommands } = require('./config/commands');

const commandPath = path.resolve(__dirname, './commands');
const eventsPath = path.resolve(__dirname, './events');

const commandFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith('.js'));

const commands = new Collection();
const commandsData = [];

commandFiles.forEach((file) => {
  const { data, callback, userPermissions } = require(`${commandPath}/${file}`);
  commands.set(data.name, { callback, userPermissions });
  commandsData.push(data);
});

const events = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'))
  .map((file) => require(`${eventsPath}/${file}`));

async function main() {
  await initCommands(commandsData);
  initClient(commands, events);
}

main();
