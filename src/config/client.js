const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { TOKEN } = process.env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

exports.initClient = (commands, events, buttons) => {
  client.on('ready', async () => {
    client.commands = commands;
    client.buttons = buttons;

    console.log(`Logged in as ${client.user.tag}!`);
  });

  for (const event of events) {
    client.on(event.name, event.callback);
  }

  client.login(TOKEN);
};
