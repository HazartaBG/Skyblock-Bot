const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { errorEmbed } = require('../embeds/errorEmbed');
const { ServerError } = require('../errors/serverError');
const { TOKEN } = process.env;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, 'GUILD_MEMBERS'],
});

const talkedRecently = new Set();

const deleteAfterInMiliseconds = 10000;
const cooldownInMiliseconds = 10000;

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
        if (talkedRecently.has(interaction.user.id)) {
          throw new ServerError('You are on cooldown. Try again in a bit.');
        }

        talkedRecently.add(interaction.user.id);

        setTimeout(() => {
          talkedRecently.delete(interaction.user.id);
        }, cooldownInMiliseconds);

        const content = await command.callback(interaction);
        const result = typeof content == 'string' ? { content } : content;

        await interaction.reply({ ...result });
      }
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
