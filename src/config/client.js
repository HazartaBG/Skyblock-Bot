const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { errorEmbed } = require('../embeds/errorEmbed');
const { TOKEN } = process.env;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, 'GUILD_MEMBERS'],
});

exports.initClient = (commands) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(
      (command) => interaction.commandName == command.data.name
    );

    try {
      if (command) {
        await interaction.reply(await command.callback(interaction));
      }
    } catch (e) {
      const message = e.message || 'Internal Error';
      await interaction.reply({ embeds: [errorEmbed(message)] });
    }
  });

  client.login(TOKEN);
};
