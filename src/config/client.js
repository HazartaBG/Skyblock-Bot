const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { errorEmbed } = require('../embeds/errorEmbed');
const { ServerError } = require('../errors/serverError');
const { TOKEN } = process.env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const talkedRecently = new Set();
const cooldownInMiliseconds = 10000;

exports.initClient = (commands) => {
  client.on('ready', async () => {
    client.commands = commands;
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (talkedRecently.has(interaction.user.id)) {
        throw new ServerError('You are on cooldown. Try again in a bit.');
      }

      talkedRecently.add(interaction.user.id);

      setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
      }, cooldownInMiliseconds);

      const content = await command(interaction);
      await interaction.reply(content);
    } catch (e) {
      let message;

      if (!(e instanceof ServerError)) {
        console.log(e);
        message = 'Internal Error';
      } else {
        message = e.message;
      }

      await interaction.reply({
        embeds: [errorEmbed(message)],
        ephemeral: true,
      });
    }
  });

  client.login(TOKEN);
};
