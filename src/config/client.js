const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { TOKEN } = process.env;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

exports.initClient = (commands) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(
      (command) => interaction.commandName == command.data.name
    );

    if (command) await command.callback(interaction);
  });

  client.login(TOKEN);
};
